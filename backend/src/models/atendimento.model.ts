// CRUD de usuário utilizando Prisma na tabela "Atendimento"

import { PrismaClient, Atendimento } from "@prisma/client";

const prisma = new PrismaClient();

export class AtendimentoModel {
  async create(data: Omit<Atendimento, "id">): Promise<Atendimento> {
    return await prisma.atendimento.create({
      data,
    });
  }

  async getAll(): Promise<Atendimento[]> {
    return await prisma.atendimento.findMany();
  }

  async getOne(id: string): Promise<Atendimento | null> {
    return await prisma.atendimento.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Atendimento, "id">>
  ): Promise<Atendimento | null> {
    return await prisma.atendimento.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Atendimento | null> {
    return await prisma.atendimento.delete({
      where: { id },
    });
  }
}
