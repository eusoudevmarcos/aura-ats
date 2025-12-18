import { Sessao } from "@prisma/client";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";

@injectable()
export class SessaoService {
  constructor() {}

  async create(
    token: string,
    usuarioSistemaId: string,
    expiresAt: Date
  ): Promise<Sessao> {
    return await prisma.sessao.create({
      data: {
        token,
        usuarioSistemaId,
        expiresAt,
      },
    });
  }

  async findByToken(token: string): Promise<Sessao> {
    return await prisma.sessao.findFirstOrThrow({
      where: { token },
      include: {
        usuarioSistema: {
          select: {
            id: true,
            email: true,
            tipoUsuario: true,
            funcionario: {
              select: {
                pessoa: {
                  select: {
                    nome: true,
                    cpf: true,
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
        },
      },
    });
  }

  async findByUserId(usuarioSistemaId: string): Promise<Sessao | null> {
    return await prisma.sessao.findFirst({
      where: { usuarioSistemaId },
      orderBy: { expiresAt: "desc" },
    });
  }

  async update(
    token: string,
    usuarioSistemaId: string,
    expiresAt: Date
  ): Promise<Sessao> {
    return await prisma.sessao.update({
      where: { token },
      data: {
        usuarioSistemaId,
        expiresAt,
      },
    });
  }

  async upsert(
    token: string,
    usuarioSistemaId: string,
    expiresAt: Date
  ): Promise<Sessao> {
    return await prisma.sessao.upsert({
      where: { token },
      update: {
        usuarioSistemaId,
        expiresAt,
      },
      create: {
        token,
        usuarioSistemaId,
        expiresAt,
      },
    });
  }

  async delete(token: string): Promise<void> {
    await prisma.sessao.delete({
      where: { token },
    });
  }

  async deleteByUserId(usuarioSistemaId: string): Promise<void> {
    await prisma.sessao.deleteMany({
      where: { usuarioSistemaId },
    });
  }

  async deleteExpired(): Promise<void> {
    await prisma.sessao.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  async isValid(token: string): Promise<boolean> {
    const sessao = await this.findByToken(token);
    if (!sessao) return false;

    return sessao.expiresAt > new Date();
  }

  async getUserIdFromToken(token: string): Promise<string | undefined> {
    const sessao = await this.findByToken(token);
    if (!sessao || sessao.expiresAt <= new Date()) {
      return undefined;
    }
    return sessao.usuarioSistemaId;
  }
}
