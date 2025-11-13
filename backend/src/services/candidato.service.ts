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
import { AnexoService } from "./anexo.service";
import { BillingService } from "./billing.service";
import { TypeFile, UploadedFile } from "./file.service";

@injectable()
export class CandidatoService {
  constructor(
    @inject(CandidatoRepository)
    private candidatoRepository: CandidatoRepository,
    @inject(PessoaRepository)
    private pessoaRepository: PessoaRepository,
    @inject(BillingService)
    private billingService: BillingService,
    @inject(AnexoService)
    private anexoService: AnexoService
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

    // Extrair arquivos antes de processar o payload
    const files = candidatoData.files || [];
    delete candidatoData.files;

    const candidatoPayload = candidatoBuild(candidatoData);

    const includeRelations = {
      pessoa: {
        include: {
          localizacoes: true,
        },
      },
      especialidade: true,
      anexos: {
        include: {
          anexo: true,
        },
      },
    };

    console.log(candidatoPayload);

    let candidato: Candidato;

    if (candidatoData.id) {
      const { id, ...updateData } = candidatoPayload as CandidatoUpdateInput;
      candidato = await prisma.candidato.update({
        where: { id: id },
        data: updateData as any,
        include: includeRelations,
      });
    } else {
      candidato = await prisma.candidato.create({
        data: candidatoPayload as any,
        include: includeRelations,
      });
    }

    // Processar arquivos se houver
    if (files.length > 0) {
      const uploadedFiles: UploadedFile[] = files.map((file: any) => {
        // Converter base64 para Buffer
        const buffer = Buffer.from(file.buffer, "base64");
        return {
          originalname: file.originalname,
          path: "", // Será preenchido pelo FileService
          buffer: buffer,
          mimetype: file.mimetype,
          size: file.size,
          type: file.type as TypeFile,
        };
      });

      await this.anexoService.createMultipleAnexos(uploadedFiles, candidato.id);

      // Buscar candidato atualizado com anexos
      candidato = (await prisma.candidato.findUnique({
        where: { id: candidato.id },
        include: includeRelations,
      })) as Candidato;
    }

    return candidato;
  }

  async getFilePathForDownload(anexoId: string): Promise<string> {
    return await this.anexoService.getFilePathForDownload(anexoId);
  }
}
