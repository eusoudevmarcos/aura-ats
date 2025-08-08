// CRUD de usuário utilizando Prisma na tabela "Contato"

import { PrismaClient, Contato } from "@prisma/client";

const prisma = new PrismaClient();

export class ContatoModel {
  async create(data: Omit<Contato, "id">): Promise<Contato> {
    return await prisma.contato.create({
      data,
    });
  }

  async getAll(): Promise<Contato[]> {
    return await prisma.contato.findMany();
  }

  async getOne(id: string): Promise<Contato | null> {
    return await prisma.contato.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Contato, "id">>
  ): Promise<Contato | null> {
    return await prisma.contato.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Contato | null> {
    return await prisma.contato.delete({
      where: { id },
    });
  }
}
