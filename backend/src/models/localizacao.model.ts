// CRUD de usuário utilizando Prisma na tabela "Localizacao"

import { PrismaClient, Localizacao } from "@prisma/client";

const prisma = new PrismaClient();

export class LocalizacaoModel {
  async create(data: Omit<Localizacao, "id">): Promise<Localizacao> {
    return await prisma.localizacao.create({
      data,
    });
  }

  async getAll(): Promise<Localizacao[]> {
    return await prisma.localizacao.findMany();
  }

  async getOne(id: string): Promise<Localizacao | null> {
    return await prisma.localizacao.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Localizacao, "id">>
  ): Promise<Localizacao | null> {
    return await prisma.localizacao.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Localizacao | null> {
    return await prisma.localizacao.delete({
      where: { id },
    });
  }
}
