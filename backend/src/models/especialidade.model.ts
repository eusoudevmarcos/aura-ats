// CRUD de usuário utilizando Prisma na tabela "Especialidade"

import { PrismaClient, Especialidade } from "@prisma/client";

const prisma = new PrismaClient();

export class EspecialidadeModel {
  async create(data: Omit<Especialidade, "id">): Promise<Especialidade> {
    return await prisma.especialidade.create({
      data,
    });
  }

  async getAll(): Promise<Especialidade[]> {
    return await prisma.especialidade.findMany();
  }

  async getOne(id: string): Promise<Especialidade | null> {
    return await prisma.especialidade.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Especialidade, "id">>
  ): Promise<Especialidade | null> {
    return await prisma.especialidade.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Especialidade | null> {
    return await prisma.especialidade.delete({
      where: { id },
    });
  }
}
