import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { UsuarioSistema } from "@prisma/client";

@injectable()
export class UsuarioSistemaRepository {
  async save(data: any) {
    if (data.id) {
      return await prisma.usuarioSistema.update({ where: data.id, data });
    }
    return await prisma.usuarioSistema.create({
      data,
    });
  }

  async getUniqueEmail(email: string): Promise<UsuarioSistema | null> {
    return await prisma.usuarioSistema.findFirst({ where: { email } });
  }
}
