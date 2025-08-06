// CRUD de usuário utilizando Prisma na tabela "Contatos"

import { PrismaClient, Contatos } from "@prisma/client";

const prisma = new PrismaClient();

export class ContatosModel {
  async create(data: Omit<Contatos, "id">): Promise<Contatos> {
    return await prisma.contatos.create({
      data,
    });
  }

  async getAll(): Promise<Contatos[]> {
    return await prisma.contatos.findMany();
  }

  async getOne(id: string): Promise<Contatos | null> {
    return await prisma.contatos.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Contatos, "id">>
  ): Promise<Contatos | null> {
    return await prisma.contatos.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Contatos | null> {
    return await prisma.contatos.delete({
      where: { id },
    });
  }
}
