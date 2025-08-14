import { Empresa } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { splitCreateConnect } from "../utils/splitCreateConnect";
import prisma from "../lib/prisma";
import { EmpresaCreateInput, EmpresaUpdateInput } from "../types/prisma.types";
import { PessoaRepository } from "../repository/pessoa.repository";

@injectable()
export class EmpresaRepository {
  constructor(
    @inject(PessoaRepository) private pessoaRepository: PessoaRepository
  ) {}

  get(empresaData: any): EmpresaCreateInput | EmpresaUpdateInput {
    const baseData = {
      razaoSocial: empresaData.razaoSocial,
      cnpj: empresaData.cnpj,
      dataAbertura: empresaData.dataAbertura
        ? new Date(empresaData.dataAbertura)
        : null,
      representante: splitCreateConnect(
        empresaData.representantes?.map((p: any) => {
          if (p.id) {
            return { id: p.id };
          } else {
            return this.pessoaRepository.getCreateInput(p);
          }
        })
      ) as EmpresaCreateInput["representantes"],
      contatos: splitCreateConnect(
        empresaData.contatos
      ) as EmpresaCreateInput["contatos"],
      localizacoes: splitCreateConnect(
        empresaData.localizacoes
      ) as EmpresaCreateInput["localizacoes"],
      socios: empresaData.socios?.length
        ? {
            create: empresaData.socios.map((s: any) => ({
              tipoSocio: s.tipoSocio,
              pessoa: s.pessoaId
                ? { connect: { id: s.pessoaId } }
                : { create: this.pessoaRepository.getCreateInput(s.pessoa) },
            })),
          }
        : undefined,
    };

    if (empresaData.id) {
      return { id: empresaData.id, ...baseData } as EmpresaUpdateInput;
    }
    return baseData as EmpresaCreateInput;
  }

  async save(empresaData: EmpresaUpdateInput): Promise<Empresa> {
    empresaData.cnpj = empresaData.cnpj?.replace(/\D/g, "");
    const data = this.get(empresaData);

    if ((data as EmpresaUpdateInput).id) {
      const { id, ...updateData } = data as EmpresaUpdateInput;
      return await prisma.empresa.update({
        where: { id: id },
        data: updateData as any,
      });
    } else {
      return await prisma.empresa.create({
        data: data as any,
      });
    }
  }

  async findById(id: string): Promise<Empresa | null> {
    return await prisma.empresa.findUnique({
      where: { id },
      include: {
        contatos: true,
        localizacoes: true,
        representantes: true,
        socios: {
          include: {
            pessoa: true,
          },
        },
      },
    });
  }

  async findByCnpj(cnpj: string): Promise<Empresa | null> {
    return await prisma.empresa.findFirst({
      where: { cnpj },
    });
  }
}
