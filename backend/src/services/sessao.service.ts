import { Sessao } from "@prisma/client";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";

@injectable()
export class SessaoService {
  constructor() {}

  async create(
    token: string,
    userId: string,
    expiresAt: Date
  ): Promise<Sessao> {
    return await prisma.sessao.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findByToken(token: string): Promise<Sessao | null> {
    return await prisma.sessao.findUnique({
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

  async findByUserId(userId: string): Promise<Sessao | null> {
    return await prisma.sessao.findFirst({
      where: { userId },
      orderBy: { expiresAt: "desc" },
    });
  }

  async update(
    token: string,
    userId: string,
    expiresAt: Date
  ): Promise<Sessao> {
    return await prisma.sessao.update({
      where: { token },
      data: {
        userId,
        expiresAt,
      },
    });
  }

  async upsert(
    token: string,
    userId: string,
    expiresAt: Date
  ): Promise<Sessao> {
    return await prisma.sessao.upsert({
      where: { token },
      update: {
        userId,
        expiresAt,
      },
      create: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async delete(token: string): Promise<void> {
    await prisma.sessao.delete({
      where: { token },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.sessao.deleteMany({
      where: { userId },
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

  async getUserIdFromToken(token: string): Promise<string | null> {
    const sessao = await this.findByToken(token);
    if (!sessao || sessao.expiresAt <= new Date()) {
      return null;
    }
    return sessao.userId;
  }
}
