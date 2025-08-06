// CRUD de usuário utilizando Prisma na tabela "Formacao"

import { PrismaClient, Formacao } from "@prisma/client";

const prisma = new PrismaClient();

export class FormacaoModel {
  async create(data: Omit<Formacao, "id">): Promise<Formacao> {
    return await prisma.formacao.create({
      data,
    });
  }

  async getAll(): Promise<Formacao[]> {
    return await prisma.formacao.findMany();
  }

  async getOne(id: string): Promise<Formacao | null> {
    return await prisma.formacao.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Formacao, "id">>
  ): Promise<Formacao | null> {
    return await prisma.formacao.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Formacao | null> {
    return await prisma.formacao.delete({
      where: { id },
    });
  }
}
