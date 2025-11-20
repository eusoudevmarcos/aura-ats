// src/services/candidato.service.ts
import { Candidato, Especialidade } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import CacheController from "../controllers/cache.controller";
import candidatoBuild from "../helper/buildNested/candidato.build";
import { normalizeCandidatoData } from "../helper/normalize/candidato.normalize";
import { validateBasicFieldsCandidato } from "../helper/validate/candidato.validate";
import prisma from "../lib/prisma";
import { CandidatoRepository } from "../repository/candidato.repository";
import { CandidatoUpdateInput } from "../types/prisma.types";
import { AnexoService } from "./anexo.service";
import { BillingService } from "./billing.service";

@injectable()
export class CandidatoService {
  constructor(
    @inject(CandidatoRepository)
    private candidatoRepository: CandidatoRepository,
    @inject(BillingService)
    private billingService: BillingService,
    @inject(AnexoService)
    private anexoService: AnexoService,
    @inject(CacheController)
    private cacheController: CacheController
  ) {}

  async getEspecialidades(): Promise<Especialidade[]> {
    return await prisma.especialidade.findMany();
  }

  async getCandidatoById(
    id: string,
    clienteId?: string
  ): Promise<Candidato | null> {
    // Buscar candidato com anexos
    const candidato = await prisma.candidato.findUnique({
      where: { id },
      include: {
        pessoa: { include: { localizacoes: true } },
        especialidade: true,
        formacoes: true,
        medico: { include: { crm: true } },
        anexos: {
          include: {
            anexo: true,
          },
        },
      },
    });

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
        console.log("Erro ao debitar uso:", error);
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

    const anexos = candidatoData.anexos || [];
    delete candidatoData.anexos;

    const candidatoPayload = candidatoBuild(candidatoData);

    const includeRelations = {
      pessoa: { include: { localizacoes: true } },
      especialidade: true,
      anexos: { include: { anexo: true } },
      medico: { include: { crm: true } },
    };
    console.log("SALVANDO CANDIDATO");
    let candidato: any;

    // Cria ou atualiza o candidato
    if (candidatoData.id) {
      const { id, ...updateData } = candidatoPayload as CandidatoUpdateInput;
      candidato = await prisma.candidato.update({
        where: { id },
        data: updateData as any,
        include: includeRelations,
      });
    } else {
      candidato = await prisma.candidato.create({
        data: candidatoPayload as any,
        include: includeRelations,
      });
    }

    const key = this.cacheController.buildKey({
      typeData: "CPF",
      input: candidato.pessoa.cpf,
    });

    const payload = this.cacheController.getCachedRequest(key);
    this.cacheController.saveCachedRequest(key, {
      ...payload,
      candidato,
      isSave: true,
    });

    // === 🧩 PROCESSAR ANEXOS ===
    if (!Array.isArray(anexos)) return candidato;

    // Nenhum anexo enviado → apaga todos
    if (anexos.length === 0) {
      await this.anexoService.deleteAllAnexosByCandidatoId(candidato.id);
      return (await prisma.candidato.findUnique({
        where: { id: candidato.id },
        include: includeRelations,
      })) as Candidato;
    }

    // 🔹 Anexos existentes no banco
    const anexosExistentes = await this.anexoService.getAnexosByCandidatoId(
      candidato.id
    );

    // 🔹 IDs dos anexos enviados na request
    const idsRequest = anexos
      .map((a) => a.anexoId || a.anexo?.id)
      .filter(Boolean);

    // 🔹 Anexos para remover (existem no banco, mas não vieram na request)
    const anexosParaRemover = anexosExistentes.filter(
      (existente) => !idsRequest.includes(existente.anexo.id)
    );

    // Remove do banco + disco
    for (const remover of anexosParaRemover) {
      await this.anexoService.deleteAnexo(remover.anexo.id, candidato.id);
    }

    // 🔹 Novos anexos (sem ID ainda)
    const novosAnexos = anexos.filter((a) => !a.anexoId && !a.anexo?.id);

    // 🔹 Evita duplicar (nome + tamanho já existente)
    const arquivosParaAdicionar = novosAnexos.filter((novo) => {
      return !anexosExistentes.some(
        (existente) =>
          existente.anexo.nomeArquivo === novo.anexo.nomeArquivo &&
          existente.anexo.tamanhoKb === novo.anexo.tamanhoKb
      );
    });

    if (arquivosParaAdicionar.length > 0) {
      await this.anexoService.createMultipleAnexos(
        arquivosParaAdicionar,
        candidato.id
      );
    }

    // 🔹 Retorna candidato atualizado
    candidato = await prisma.candidato.findUnique({
      where: { id: candidato.id },
      include: includeRelations,
    });

    return candidato;
  }

  async getFilePathForDownload(anexoId: string): Promise<string> {
    return await this.anexoService.getFilePathForDownload(anexoId);
  }
}
