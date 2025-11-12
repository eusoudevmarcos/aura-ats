// src/services/candidato.service.ts
import { Candidato, Especialidade } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import candidatoBuild from "../helper/buildNested/candidato.build";
import { normalizeCandidatoData } from "../helper/normalize/candidato.normalize";
import { validateBasicFieldsCandidato } from "../helper/validate/candidato.validate";
import prisma from "../lib/prisma";
import { CandidatoRepository } from "../repository/candidato.repository";
import { PessoaRepository } from "../repository/pessoa.repository";
import { CandidatoUpdateInput } from "../types/prisma.types";
import { BillingService } from "./billing.service";

@injectable()
export class CandidatoService {
  constructor(
    @inject(CandidatoRepository)
    private candidatoRepository: CandidatoRepository,
    @inject(PessoaRepository)
    private pessoaRepository: PessoaRepository,
    @inject(BillingService)
    private billingService: BillingService
  ) {}

  async getEspecialidades(): Promise<Especialidade[]> {
    return await prisma.especialidade.findMany();
  }

  async getCandidatoById(
    id: string,
    clienteId?: string
  ): Promise<Candidato | null> {
    const candidato = await this.candidatoRepository.findById(id);

    // Se um cliente está consultando, debita um uso do plano
    if (candidato && clienteId) {
      try {
        await this.billingService.debitarUsoCliente(
          clienteId,
          "consulta_profissional"
        );
        console.log(
          `Uso debitado para cliente ${clienteId} ao consultar candidato ${id}`
        );
      } catch (error) {
        console.error("Erro ao debitar uso:", error);
        // Não falha a consulta se não conseguir debitar o uso
      }
    }

    return candidato;
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
    candidatoData = normalizeCandidatoData(candidatoData);

    validateBasicFieldsCandidato(candidatoData);

    const candidatoPayload = candidatoBuild(candidatoData);

    const includeRelations = {
      pessoa: {
        include: {
          localizacoes: true,
        },
      },
      especialidade: true,
    };

    console.log(candidatoPayload);

    if (candidatoData.id) {
      const { id, ...updateData } = candidatoPayload as CandidatoUpdateInput;
      return await prisma.candidato.update({
        where: { id: id },
        data: updateData as any,
        include: includeRelations,
      });
    } else {
      return await prisma.candidato.create({
        data: candidatoPayload as any,
        include: includeRelations,
      });
    }
  }
}
