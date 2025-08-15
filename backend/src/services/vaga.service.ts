// src/services/VagaService.ts
import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { VagaRepository } from "../repository/vaga.repository";
import {
  CategoriaVaga,
  NivelExperiencia,
  StatusVaga,
  TipoContrato,
  Vaga,
} from "@prisma/client";
@injectable()
export class VagaService {
  constructor(
    @inject(VagaRepository)
    private vagaRepository: VagaRepository
  ) {}

  async save(vagaData: any): Promise<Vaga> {
    return await prisma.$transaction(async (tx) => {
      // 1. Validação de Dados Essenciais
      if (!vagaData.titulo) {
        throw new Error("O título da vaga é obrigatório.");
      }
      if (!vagaData.cliente || !vagaData.cliente?.id) {
        throw new Error(
          "A vaga deve estar associada a um cliente existente (clienteId)."
        );
      }

      if (
        vagaData.status &&
        !Object.values(StatusVaga).includes(vagaData.status)
      ) {
        throw new Error(`Status de vaga inválido: ${vagaData.status}`);
      }
      if (
        vagaData.categoria &&
        !Object.values(CategoriaVaga).includes(vagaData.categoria)
      ) {
        throw new Error(`Categoria de vaga inválida: ${vagaData.categoria}`);
      }
      if (
        vagaData.tipoContrato &&
        !Object.values(TipoContrato).includes(vagaData.tipoContrato)
      ) {
        throw new Error(`Tipo de contrato inválido: ${vagaData.tipoContrato}`);
      }
      if (
        vagaData.nivelExperiencia &&
        !Object.values(NivelExperiencia).includes(vagaData.nivelExperiencia)
      ) {
        throw new Error(
          `Nível de experiência inválido: ${vagaData.nivelExperiencia}`
        );
      }

      const clienteId = vagaData.cliente.id;
      const clienteExiste = await tx.cliente.findFirst({
        where: { id: clienteId },
      });

      if (!clienteExiste) {
        throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
      }

      const dataToSave = { ...vagaData };

      const savedVaga = await this.vagaRepository.saveWithTransaction(
        dataToSave
      );

      return savedVaga;
    });
  }

  async getVagaById(id: string): Promise<Vaga | null> {
    return await this.vagaRepository.findById(id);
  }

  async getAllVagas(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    data: Vaga[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const { data, total } = await this.vagaRepository.findAll(page, pageSize);
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async deleteVaga(id: string): Promise<Vaga> {
    return await prisma.$transaction(async (tx) => {
      const vaga = await this.vagaRepository.findByIdWithTransaction(id, tx);
      if (!vaga) {
        throw new Error(`Vaga com ID ${id} não encontrada.`);
      }

      return await this.vagaRepository.deleteWithTransaction(id, tx);
    });
  }
}
