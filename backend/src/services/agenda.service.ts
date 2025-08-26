import { AgendaVaga } from "@prisma/client";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { parseDateTime } from "../utils/parseDateTime";

// Tipos para entrada de dados da agenda

export type AgendaInput = {
  dataHora: Date | string;
  link?: string;
  tipoEvento:
    | "TRIAGEM_INICIAL"
    | "ENTREVISTA_RH"
    | "ENTREVISTA_GESTOR"
    | "TESTE_TECNICO"
    | "TESTE_PSICOLOGICO"
    | "DINAMICA_GRUPO"
    | "PROPOSTA"
    | "OUTRO";
  localizacaoId?: string | null;
  vagaId?: string | null;
  etapaAtualId?: string | null;
};

@injectable()
export class AgendaService {
  constructor() {}

  async create(agendaData: AgendaInput): Promise<AgendaVaga> {
    const dataHora = parseDateTime(agendaData.dataHora);

    return await prisma.agendaVaga.create({
      data: {
        dataHora: new Date(agendaData.dataHora),
        link: agendaData.link,
        tipoEvento: agendaData.tipoEvento,
        localizacaoId: agendaData.localizacaoId,
        vagaId: agendaData.vagaId ?? undefined,
        etapaAtualId: agendaData.etapaAtualId,
      },
    });
  }

  async update(agendaId: string, agendaData: any): Promise<AgendaVaga> {
    return await prisma.agendaVaga.update({
      where: { id: agendaId },
      data: {
        dataHora: agendaData.dataHora,
        link: agendaData.link,
        tipoEvento: agendaData.tipoEvento,
        localizacaoId: agendaData.localizacaoId,
        vagaId: agendaData.vagaId,
        etapaAtualId: agendaData.etapaAtualId,
      },
    });
  }

  async delete(agendaId: string): Promise<void> {
    await prisma.agendaVaga.delete({
      where: { id: agendaId },
    });
  }

  async findById(id: string): Promise<AgendaVaga | null> {
    return await prisma.agendaVaga.findUnique({
      where: { id },
      include: {
        vaga: true,
        localizacao: true,
        etapaAtual: true,
      },
    });
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    data: AgendaVaga[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.agendaVaga.findMany({
        skip,
        take: pageSize,
        include: {
          vaga: true,
          localizacao: true,
          etapaAtual: true,
        },
        orderBy: { dataHora: "desc" },
      }),
      prisma.agendaVaga.count(),
    ]);
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
