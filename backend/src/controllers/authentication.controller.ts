import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Body, Controller, Post, Req, Res } from "routing-controllers";
import { Authorized } from "../decorators/Authorized";
import { saveLog } from "../lib/logger";
import prisma from "../lib/prisma";

const SECRET = process.env.JWT_SECRET;

@Controller("/auth")
export default class AuthenticationController {
  @Post("/login")
  async logIn(
    @Body({ required: false })
    body: { username?: string; password?: string } = {},
    @Res() res: Response
  ) {
    const { username, password } = body || {};

    if (!username || !password) {
      res.status(400).json({ error: "Email e senha são obrigatórios." });
      return res;
    }

    const usuarioSistema = await prisma.usuarioSistema.findUnique({
      where: { email: username },
      select: {
        id: true,
        tipoUsuario: true,
        password: true,
        funcionario: {
          select: {
            pessoa: {
              select: {
                cpf: true,
                nome: true,
              },
            },
          },
        },
        cliente: {
          select: {
            empresa: {
              select: {
                razaoSocial: true,
                cnpj: true,
              },
            },
          },
        },
      },
    });

    if (!usuarioSistema) {
      await saveLog({
        type: "login",
        status: "error",
        data: { message: "Funcionário não encontrado" },
      });
      res.status(404).json({ error: "Dados não encontrados" });
      return res;
    }

    const senhaCorreta = await bcrypt.compare(
      password,
      usuarioSistema.password
    );

    if (password !== usuarioSistema.password) {
      await saveLog({
        type: "login",
        status: "error",
        data: { message: "Senha incorreta" },
      });

      res.status(401).json({ error: "Credenciais inválidas" });
      return res;
    }

    const infoUser = {
      uid: usuarioSistema.id,
      email: username,
      tipo: usuarioSistema.tipoUsuario,
    };

    if (usuarioSistema.funcionario?.pessoa) {
      Object.assign(infoUser, {
        nome: usuarioSistema.funcionario?.pessoa?.nome,
        cpf: usuarioSistema.funcionario?.pessoa?.cpf,
      });
    } else if (usuarioSistema.cliente?.empresa) {
      Object.assign(infoUser, {
        razaoSocial: usuarioSistema.cliente.empresa?.razaoSocial,
        cnpj: usuarioSistema.cliente.empresa?.cnpj,
      });
    }

    // Antes de gerar novo token, verifica sessão existente ativa
    const sessaoExistente = await prisma.sessao.findFirst({
      where: {
        usuarioSistemaId: usuarioSistema.id,
      },
      orderBy: { expiresAt: "desc" }, // pega a mais recente
    });

    const now = new Date();

    if (sessaoExistente) {
      if (sessaoExistente.expiresAt > now) {
        // Sessão ainda está válida, loga direto com o mesmo token
        const token = sessaoExistente.token;

        const isProduction = process.env.NODE_ENV === "production";
        res.setHeader(
          "Set-Cookie",
          serialize("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 2,
            secure: isProduction,
            sameSite: isProduction
              ? "none"
              : ("lax" as "lax" | "none" | "strict" | undefined),
          })
        );

        await saveLog({
          type: "login",
          status: "success",
          data: {
            email: username,
            uid: usuarioSistema.id,
            token,
          },
        });

        res.status(200).json({
          message: "Login bem-sucedido",
          uid: usuarioSistema.id,
          token,
        });
        return res;
      } else {
        // Sessão expirada, apaga do banco antes de criar nova
        await prisma.sessao.delete({
          where: { token: sessaoExistente.token },
        });
      }
    }

    // Gera token JWT novo
    const token = jwt.sign(infoUser, SECRET!, { expiresIn: "2h" });

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2);

    await prisma.sessao.create({
      data: {
        token,
        usuarioSistemaId: usuarioSistema.id,
        expiresAt,
      },
    });

    const isProduction = process.env.NODE_ENV === "production";
    // Define cookie httpOnly
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 2,
        secure: isProduction,
        sameSite: isProduction
          ? "none"
          : ("lax" as "lax" | "none" | "strict" | undefined),
      })
    );

    await saveLog({
      type: "login",
      status: "success",
      data: {
        email: username,
        uid: usuarioSistema.id,
        token,
      },
    });

    res
      .status(200)
      .json({ message: "Login bem-sucedido", uid: usuarioSistema.id, token });
    return res;
  }

  @Post("/logout")
  @Authorized()
  async logOut(@Req() req: Request, @Res() res: Response) {
    // Limpar o cookie do token
    res.setHeader(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      })
    );

    // Além de limpar o cookie, apagar a sessão do backend
    // Se token estiver presente nos cookies ou headers, remover a sessão do banco
    let token = "";

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (
      typeof req.headers.authorization === "string" &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.substring(7);
    }

    if (token) {
      // Delete session in DB
      await prisma.sessao.deleteMany({ where: { token } });
    }

    await saveLog({
      type: "logout",
      status: "success",
      data: {},
    });

    res.status(200).json({ message: "Logout realizado com sucesso" });
    return res;
  }

  @Post("/register")
  async register(@Res() res: Response) {
    res
      .status(501)
      .json({ message: "Registro de usuário não implementado para Prisma." });
    return res;
  }
}
