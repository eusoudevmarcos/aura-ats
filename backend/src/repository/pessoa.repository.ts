import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { Pessoa } from "@prisma/client";

@injectable()
export class PessoaRepository {
  async save(data: any, prismaClient = prisma) {
    if (data.id) {
      return await prismaClient.pessoa.update({ where: data.id, data });
    }
    return await prismaClient.pessoa.create({
      data,
    });
  }

  async getFisrt(id: string, prismaClient = prisma): Promise<Pessoa | null> {
    return await prismaClient.pessoa.findFirst({ where: { id } });
  }

  async getFisrtCpf(
    cpf: string,
    prismaClient = prisma
  ): Promise<Pessoa | null> {
    return await prismaClient.pessoa.findFirst({ where: { cpf } });
  }
}
