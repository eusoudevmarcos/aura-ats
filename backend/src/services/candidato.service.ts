// src/services/candidato.service.ts
import { Candidato, Especialidade } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { BuildNestedOperation } from "../helper/buildNested/buildNestedOperation";
import { validateBasicFieldsCandidato } from "../helper/validate/candidato.validate";
import prisma from "../lib/prisma";
import { CandidatoRepository } from "../repository/candidato.repository";
import { PessoaRepository } from "../repository/pessoa.repository";
import { CandidatoUpdateInput } from "../types/prisma.types";

@injectable()
export class CandidatoService {
  constructor(
    @inject(CandidatoRepository)
    private candidatoRepository: CandidatoRepository,
    @inject(PessoaRepository)
    private pessoaRepository: PessoaRepository
  ) {}

  async getEspecialidades(): Promise<Especialidade[]> {
    return await prisma.especialidade.findMany();
  }

  async getCandidatoById(id: string): Promise<Candidato | null> {
    return await this.candidatoRepository.findById(id);
  }

  async getAllCandidatos(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    data: Candidato[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const { data, total } = await this.candidatoRepository.findAll(
      page,
      pageSize
    );
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async deleteCandidato(id: string): Promise<Candidato> {
    return await prisma.$transaction(async (tx) => {
      const candidato = await this.candidatoRepository.findByIdWithTransaction(
        id,
        tx
      );
      if (!candidato) {
        throw new Error(`Candidato com ID ${id} não encontrado.`);
      }
      return await this.candidatoRepository.deleteWithTransaction(id, tx);
    });
  }

  async save(candidatoData: any): Promise<Candidato> {
    candidatoData.pessoa.cpf = candidatoData.pessoa.cpf.replace(/\D/g, "");
    validateBasicFieldsCandidato(candidatoData);

    const buildNestedOperation = new BuildNestedOperation();
    const { id, ...rest } = candidatoData;
    let data = {};
    if (rest) {
      data = buildNestedOperation.build(rest);
    }

    const includeRelations = {
      pessoa: {
        include: {
          contatos: true,
          localizacoes: true,
        },
      },
      especialidade: true,
      formacoes: true,
    };

    if (id) {
      const { id, ...updateData } = candidatoData as CandidatoUpdateInput;
      return await prisma.candidato.update({
        where: { id: id },
        data: data as any,
        include: includeRelations,
      });
    } else {
      return await prisma.candidato.create({
        data: data as any,
        include: includeRelations,
      });
    }
  }
}
