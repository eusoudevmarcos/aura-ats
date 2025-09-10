// src/services/candidato.service.ts
import { AreaCandidato, Candidato, Especialidade } from "@prisma/client";
import { inject, injectable } from "tsyringe";
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
    if (!candidatoData.pessoa || !candidatoData.pessoa.cpf) {
      throw new Error(
        "Dados da pessoa e CPF são obrigatórios para um candidato."
      );
    }

    const cpfLimpo = candidatoData.pessoa.cpf.replace(/\D/g, "");
    const existingPessoaByCpf = await this.pessoaRepository.findByCpf(cpfLimpo);

    if (existingPessoaByCpf) {
      throw new Error("Candidato já existe");
    }

    if (!candidatoData.areaCandidato) {
      throw new Error("A área do candidato é obrigatória.");
    }

    if (!Object.values(AreaCandidato).includes(candidatoData.areaCandidato)) {
      throw new Error(
        `Área do candidato inválida: ${candidatoData.areaCandidato}`
      );
    }

    if (
      !!candidatoData.especialidadeId &&
      candidatoData.especialidadeId !== ""
    ) {
      candidatoData.especialidadeId = Number(candidatoData.especialidadeId);
    }

    candidatoData.pessoa.cpf = candidatoData.pessoa.cpf.replace(/\D/g, "");

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

    if (candidatoData.id) {
      const { id, ...updateData } = candidatoData as CandidatoUpdateInput;
      return await prisma.candidato.update({
        where: { id: id },
        data: updateData as any,
        include: includeRelations,
      });
    } else {
      return await prisma.candidato.create({
        data: candidatoData as any,
        include: includeRelations,
      });
    }
  }
}
