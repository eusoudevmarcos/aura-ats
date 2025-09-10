import { Funcionario } from "@prisma/client";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";

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
