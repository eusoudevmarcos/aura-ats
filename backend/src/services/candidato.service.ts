// src/services/candidato.service.ts
import { AreaCandidato, Candidato, Especialidade } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { BuildNestedOperation } from "../helper/buildNested/buildNestedOperation";
import { normalizeCandidatoData } from "../helper/normalize/candidato.normalize";
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
    if (!candidatoData.id) validateBasicFieldsCandidato(candidatoData);

    candidatoData = normalizeCandidatoData(candidatoData);

    const buildNestedOperation = new BuildNestedOperation();

    let CandidatoData = {
      id: candidatoData?.id,
      rqe: candidatoData.rqe,
      crm: candidatoData.crm,
      corem: candidatoData.coren,
      areaCandidato: candidatoData.areaCandidato as AreaCandidato,
    } as any;

    const { id, rqe, areaCandidato, crm, corem, ...rest } = candidatoData;

    if (rest.pessoa) {
      CandidatoData.pessoa = buildNestedOperation.build(rest.pessoa);
    }

    if (rest.especialidade || rest.especialidadeId) {
      if (rest.especialidadeId) {
        rest.especialidade = {
          ...(rest.especialidade ?? {}),
          id: rest.especialidadeId,
        };
      }
      CandidatoData.especialidade = buildNestedOperation.build(
        rest.especialidade
      );
    }

    if (rest.formacoes || rest.formacoes) {
      CandidatoData.formacoes = buildNestedOperation.build(rest.formacoes);
    }

    // if (rest.localizacoes || rest.localizacoes) {
    //   CandidatoData.localizacao = buildNestedOperation.build(rest.localizacoes);
    // }

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

    console.log(CandidatoData);

    if (CandidatoData.id) {
      const { id, ...updateData } = CandidatoData as CandidatoUpdateInput;
      return await prisma.candidato.update({
        where: { id: id },
        data: updateData as any,
        include: includeRelations,
      });
    } else {
      return await prisma.candidato.create({
        data: CandidatoData as any,
        include: includeRelations,
      });
    }
  }
}
