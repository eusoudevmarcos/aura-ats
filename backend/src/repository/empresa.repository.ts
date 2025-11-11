import { Empresa, PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { EmpresaCreateInput, EmpresaUpdateInput } from "../types/prisma.types";
import { splitCreateConnect } from "../utils/splitCreateConnect";
import { PessoaRepository } from "./pessoa.repository";

@injectable()
export class EmpresaRepository {
  constructor(
    @inject(PessoaRepository) private pessoaRepository: PessoaRepository
  ) {}

  get(empresaData: any): EmpresaCreateInput | EmpresaUpdateInput {
    const baseData: any = {
      razaoSocial: empresaData.razaoSocial,
      cnpj: empresaData.cnpj,
      dataAbertura: empresaData.dataAbertura
        ? new Date(empresaData.dataAbertura)
        : null,
      contatos: splitCreateConnect(empresaData.contatos),
      localizacoes: splitCreateConnect(empresaData.localizacoes),
    };

    if (empresaData.id) {
      return { id: empresaData.id, ...baseData } as EmpresaUpdateInput;
    }
    return baseData as EmpresaCreateInput;
  }

  async saveWithTransaction(
    empresaData: any,
    tx: Omit<
      PrismaClient,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ): Promise<Empresa> {
    const isUpdate = !!empresaData.id;

    const representantesPayload: any[] = [];
    if (empresaData.representante && empresaData.representante.length > 0) {
      for (const rep of empresaData.representante) {
        const savedPessoa = await this.pessoaRepository.saveWithTransaction(
          rep,
          tx
        );
        representantesPayload.push({ id: savedPessoa.id });
      }
    }

    const sociosPayload: any[] = [];
    if (empresaData.socios && empresaData.socios.length > 0) {
      for (const socio of empresaData.socios) {
        const savedPessoa = await this.pessoaRepository.saveWithTransaction(
          socio.pessoa,
          tx
        );
        sociosPayload.push({
          tipoSocio: socio.tipoSocio,
          pessoa: { connect: { id: savedPessoa.id } },
        });
      }
    }

    const dataToSave = this.get(empresaData);

    if (representantesPayload.length > 0) {
      if (isUpdate) {
        (dataToSave as EmpresaUpdateInput).representantes = {
          set: representantesPayload,
        };
      } else {
        (dataToSave as EmpresaCreateInput).representantes = {
          connect: representantesPayload,
        };
      }
    }

    if (sociosPayload.length > 0) {
      if (isUpdate) {
        (dataToSave as EmpresaUpdateInput).socios = { create: sociosPayload };
      } else {
        (dataToSave as EmpresaCreateInput).socios = { create: sociosPayload };
      }
    }

    if (isUpdate) {
      const { id, ...updateData } = dataToSave as EmpresaUpdateInput;
      return await tx.empresa.update({
        where: { id: id },
        data: updateData as any,
      });
    } else {
      return await tx.empresa.create({
        data: dataToSave as any,
      });
    }
  }

  async findByIdWithTransaction(
    id: string,
    tx: Omit<
      PrismaClient,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ): Promise<Empresa | null> {
    return await tx.empresa.findUnique({
      // Use tx aqui
      where: { id },
      include: {
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
  async findByCnpjWithTransaction(
    cnpj: string,
    tx: Omit<
      PrismaClient,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ): Promise<Empresa | null> {
    return await tx.empresa.findFirst({
      // Use tx aqui
      where: { cnpj },
    });
  }

  // Métodos 'save', 'findById', 'findByCnpj' que podem ser chamados fora de uma transação, usando 'prisma' global.
  async save(empresaData: any): Promise<Empresa> {
    return this.saveWithTransaction(empresaData, prisma);
  }

  async findById(id: string): Promise<Empresa | null> {
    return this.findByIdWithTransaction(id, prisma);
  }

  async findByCnpj(cnpj: string): Promise<Empresa | null> {
    return this.findByCnpjWithTransaction(cnpj, prisma);
  }
}
