import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { Funcionario } from "@prisma/client";

@injectable()
export class FuncionarioRepository {
  async save(data: any) {
    if (data.id) {
      return await prisma.funcionario.update({ where: data.id, data });
    }
    return await prisma.funcionario.create({
      data,
    });
  }

  async getFisrt(id: string): Promise<Funcionario | null> {
    return await prisma.funcionario.findFirst({ where: { id } });
  }
}
