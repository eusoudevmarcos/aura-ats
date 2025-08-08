import { Request, Response } from "express";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { saveLog } from "../lib/logger";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET as string;

export default class AuthenticationController {
  async logIn(req: Request, res: Response) {
    if (req.method !== "POST") return res.status(405).end();

    const { username, password } = req.body;

    try {
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Email e senha são obrigatórios." });
      }

      // Busca o funcionário pelo email no banco
      const funcionario = await prisma.funcionario.findUnique({
        where: { email: username },
      });

      if (!funcionario) {
        await saveLog({
          type: "login",
          status: "error",
          data: { message: "Funcionário não encontrado" },
        });
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Verifica a senha
      const senhaCorreta = await bcrypt.compare(password, funcionario.password);

      if (!senhaCorreta) {
        await saveLog({
          type: "login",
          status: "error",
          data: { message: "Senha incorreta" },
        });
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Gera token JWT
      const token = jwt.sign(
        {
          uid: funcionario.id,
          email: funcionario.email,
          tipo: funcionario.tipoUsuario,
        },
        SECRET,
        { expiresIn: "2h" }
      );

      // Define cookie httpOnly
      res.setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 2,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
      );

      res.setHeader("Authorization", `Bearer ${token}`);

      await saveLog({
        type: "login",
        status: "success",
        data: {
          email: funcionario.email,
          uid: funcionario.id,
          token,
        },
      });

      return res
        .status(200)
        .json({ message: "Login bem-sucedido", token, uid: funcionario.id });
    } catch (error: any) {
      await saveLog({
        type: "login",
        status: "error",
        data: { message: error.message },
      });

      console.error("Erro ao logar:", error);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
  }

  async logOut(req: Request, res: Response) {
    try {
      // Limpar o cookie do token
      res.setHeader(
        "Set-Cookie",
        serialize("token", "", {
          httpOnly: true,
          path: "/",
          maxAge: 0,
        })
      );

      await saveLog({
        type: "logout",
        status: "success",
        data: {},
      });

      return res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (error: any) {
      await saveLog({
        type: "logout",
        status: "error",
        data: { message: error.message },
      });

      console.error("Erro ao fazer logout:", error);
      return res.status(500).json({ error: "Erro ao fazer logout" });
    }
  }

  async register(req: Request, res: Response) {
    return res
      .status(501)
      .json({ message: "Registro de usuário não implementado para Prisma." });
  }
}
