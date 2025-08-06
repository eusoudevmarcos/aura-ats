// CRUD de usuário utilizando Prisma na tabela "Hospital"

import { PrismaClient, Hospital } from "@prisma/client";

const prisma = new PrismaClient();

export class HospitalModel {
  async create(data: Omit<Hospital, "id">): Promise<Hospital> {
    return await prisma.hospital.create({
      data,
    });
  }

  async getAll(): Promise<Hospital[]> {
    return await prisma.hospital.findMany();
  }

  async getOne(id: string): Promise<Hospital | null> {
    return await prisma.hospital.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Hospital, "id">>
  ): Promise<Hospital | null> {
    return await prisma.hospital.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Hospital | null> {
    return await prisma.hospital.delete({
      where: { id },
    });
  }
}
