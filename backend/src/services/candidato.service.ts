// src/services/candidato.service.ts
import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { CandidatoRepository } from "../repository/candidato.repository";
import { Candidato, AreaCandidato, Especialidade } from "@prisma/client";
import { PessoaRepository } from "../repository/pessoa.repository";

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
    return await prisma.$transaction(async (tx) => {
      candidatoData.pessoa.cpf = candidatoData.pessoa.cpf.replace(/\D/g, "");

      if (!candidatoData.areaCandidato) {
        throw new Error("A área do candidato é obrigatória.");
      }

      if (!Object.values(AreaCandidato).includes(candidatoData.areaCandidato)) {
        throw new Error(
          `Área do candidato inválida: ${candidatoData.areaCandidato}`
        );
      }

      if (!candidatoData.pessoa || !candidatoData.pessoa.cpf) {
        throw new Error(
          "Dados da pessoa e CPF são obrigatórios para um candidato."
        );
      }

      if (
        !!candidatoData.especialidadeId &&
        candidatoData.especialidadeId !== ""
      ) {
        candidatoData.especialidadeId = Number(candidatoData.especialidadeId);
      }

      const cpfLimpo = candidatoData.pessoa.cpf.replace(/\D/g, "");
      let existingPessoaByCpf;
      try {
        existingPessoaByCpf =
          await this.pessoaRepository.findByCpfWithTransaction(cpfLimpo, tx);
      } catch (error) {
        throw new Error("Erro interno ao validar pessoa.");
      }

      let candidatoToUpdateId: string | null = null;
      let pessoaToConnectId: string | null = null;

      if (existingPessoaByCpf) {
        pessoaToConnectId = existingPessoaByCpf.id;

        const existingCandidatoForPessoa = await tx.candidato.findUnique({
          where: { pessoaId: existingPessoaByCpf.id },
          select: { id: true },
        });

        if (existingCandidatoForPessoa) {
          if (
            candidatoData.id &&
            candidatoData.id === existingCandidatoForPessoa.id
          ) {
            candidatoToUpdateId = candidatoData.id;
          } else if (!candidatoData.id) {
            throw new Error(
              `O CPF '${candidatoData.pessoa.cpf}' já está associado a um candidato existente.`
            );
          } else {
            throw new Error(
              `O CPF '${candidatoData.pessoa.cpf}' já está associado a outro candidato.`
            );
          }
        }
      }

      let dataToSave = { ...candidatoData };

      if (candidatoToUpdateId) {
        dataToSave.id = candidatoToUpdateId;
        dataToSave.pessoa = { connect: { id: pessoaToConnectId } };
      } else if (pessoaToConnectId) {
        dataToSave.pessoa = { connect: { id: pessoaToConnectId } };
      }

      const result = await this.candidatoRepository.saveWithTransaction(
        dataToSave,
        tx
      );
      return result;
    });
  }
}
