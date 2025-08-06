// CRUD de usuário utilizando Prisma na tabela "Usuario"

import { PrismaClient, Usuario } from "@prisma/client";

const prisma = new PrismaClient();

export class UsuarioModel {
  async create(data: Omit<Usuario, "id">): Promise<Usuario> {
    return await prisma.usuario.create({
      data,
    });
  }

  async getAll(): Promise<Usuario[]> {
    return await prisma.usuario.findMany();
  }

  async getOne(id: string): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Usuario, "id">>
  ): Promise<Usuario | null> {
    return await prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Usuario | null> {
    return await prisma.usuario.delete({
      where: { id },
    });
  }
}
