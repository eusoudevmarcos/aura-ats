// src/repository/candidato.repository.ts
import { Candidato, Pessoa } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import {
  CandidatoCreateInput,
  CandidatoUpdateInput,
  PrismaTransactionClient,
} from "../types/prisma.types";
import { PessoaRepository } from "./pessoa.repository";

@injectable()
export class CandidatoRepository {
  constructor(
    @inject(PessoaRepository) private pessoaRepository: PessoaRepository
  ) {}

  private async prepareCandidatoData(
    data: any,
    isUpdate: boolean,
    tx: PrismaTransactionClient
  ): Promise<CandidatoCreateInput | CandidatoUpdateInput> {
    const baseData: any = {
      areaCandidato: data.areaCandidato,
      crm: data.crm,
      corem: data.corem,
      rqe: data.rqe,
    };

    if (data.especialidadeId) {
      baseData.especialidade = { connect: { id: data.especialidadeId } };
    } else if (data.especialidade && data.especialidade.nome) {
      const existingSpecialty = await tx.especialidade.findUnique({
        where: { nome: data.especialidade.nome },
      });
      if (existingSpecialty) {
        baseData.especialidade = { connect: { id: existingSpecialty.id } };
      } else {
        const newSpecialty = await tx.especialidade.create({
          data: {
            nome: data.especialidade.nome,
            sigla:
              data.especialidade.sigla ||
              data.especialidade.nome.substring(0, 3).toUpperCase(),
          },
        });
        baseData.especialidade = { connect: { id: newSpecialty.id } };
      }
    }

    if (!data.pessoa) {
      throw new Error("Dados da pessoa são obrigatórios para um candidato.");
    }

    const pessoaData = data.pessoa;
    const cpfLimpo = pessoaData.cpf
      ? pessoaData.cpf.replace(/\D/g, "")
      : undefined;

    let savedPessoa: Pessoa;

    if (pessoaData.id) {
      savedPessoa = await this.pessoaRepository.saveWithTransaction(
        pessoaData,
        tx
      );
      baseData.pessoa = { connect: { id: savedPessoa.id } };
    } else if (cpfLimpo) {
      const existingPessoaByCpf =
        await this.pessoaRepository.findByCpfWithTransaction(cpfLimpo, tx);
      if (existingPessoaByCpf) {
        savedPessoa = await this.pessoaRepository.saveWithTransaction(
          { ...pessoaData, id: existingPessoaByCpf.id },
          tx
        );
        baseData.pessoa = { connect: { id: savedPessoa.id } };
      } else {
        savedPessoa = await this.pessoaRepository.saveWithTransaction(
          pessoaData,
          tx
        );
        baseData.pessoa = { connect: { id: savedPessoa.id } };
      }
    } else {
      savedPessoa = await this.pessoaRepository.saveWithTransaction(
        pessoaData,
        tx
      );
      baseData.pessoa = { connect: { id: savedPessoa.id } };
    }

    if (data.formacoes && Array.isArray(data.formacoes)) {
      baseData.formacoes = { create: data.formacoes };
    }
    if (isUpdate && data.formacoes) {
      if (data.formacoes.update && Array.isArray(data.formacoes.update)) {
        baseData.formacoes = {
          ...(baseData.formacoes || {}),
          update: data.formacoes.update,
        };
      }
      if (data.formacoes.delete && Array.isArray(data.formacoes.delete)) {
        baseData.formacoes = {
          ...(baseData.formacoes || {}),
          delete: data.formacoes.delete,
        };
      }
      if (data.formacoes.set && Array.isArray(data.formacoes.set)) {
        baseData.formacoes = {
          ...(baseData.formacoes || {}),
          set: data.formacoes.set,
        };
      }
    }

    if (isUpdate && data.id) {
      return { id: data.id, ...baseData } as CandidatoUpdateInput;
    }
    return baseData as CandidatoCreateInput;
  }

  async findByIdWithTransaction(
    id: string,
    tx: PrismaTransactionClient,
    vagasPage: number = 1,
    vagasPageSize: number = 5
  ): Promise<Candidato | null> {
    const candidato = await tx.candidato.findUnique({
      where: { id },
      include: {
        pessoa: { include: { localizacoes: true } },
        formacoes: true,
        anexos: {
          include: {
            anexo: true,
          },
        },
        medico: {
          include: { crm: true, especialidades: true },
        },
      },
    });

    if (!candidato) return null;

    const vagas = await tx.vaga.findMany({
      where: {
        candidaturas: {
          some: { id: candidato.id },
        },
      },
      skip: (vagasPage - 1) * vagasPageSize,
      take: vagasPageSize,
      orderBy: {
        dataPublicacao: "desc",
      },
    });

    const totalVagas = await tx.vaga.count({
      where: {
        candidaturas: {
          some: { id: candidato.id },
        },
      },
    });

    return {
      ...candidato,
      vagas,
      _vagasPaginacao: {
        page: vagasPage,
        pageSize: vagasPageSize,
        total: totalVagas,
        totalPages: Math.ceil(totalVagas / vagasPageSize),
      },
    } as any;
  }

  async findById(id: string): Promise<Candidato | null> {
    return this.findByIdWithTransaction(id, prisma);
  }

  async findAllWithTransaction(
    page: number,
    pageSize: number,
    tx: PrismaTransactionClient
  ): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      tx.candidato.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          areaCandidato: true,
          corem: true,
          pessoa: {
            select: {
              nome: true,
              localizacoes: {
                select: {
                  uf: true,
                  cidade: true,
                },
              },
            },
          },
          medico: {
            include: { crm: true, especialidades: true },
          },
        },
        orderBy: {
          pessoa: {
            createdAt: "desc",
          },
        },
      }),
      tx.candidato.count(),
    ]);

    return { data, total };
  }

  async findAll(
    page: number,
    pageSize: number
  ): Promise<{ data: Candidato[]; total: number }> {
    return this.findAllWithTransaction(page, pageSize, prisma);
  }

  async deleteWithTransaction(
    id: string,
    tx: PrismaTransactionClient
  ): Promise<Candidato> {
    const candidatoToDelete = await tx.candidato.findUnique({ where: { id } });
    if (!candidatoToDelete) {
      throw new Error(`Candidato com ID ${id} não encontrado.`);
    }

    return await tx.candidato.delete({
      where: { id },
    });
  }

  async delete(id: string): Promise<Candidato> {
    return this.deleteWithTransaction(id, prisma);
  }
}
