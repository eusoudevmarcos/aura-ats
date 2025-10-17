import { Agenda, CategoriaVaga, TipoEventoAgenda } from "@prisma/client";
import { injectable } from "tsyringe";
import { normalizeDataAgenda } from "../helper/normalize/agenda.normalize";
import prisma from "../lib/prisma";

// Tipos para entrada de dados da agenda

export type AgendaInput = {
  id?: string;
  titulo: string;
  dataHora: Date | string;
  link?: string;
  tipoEvento: TipoEventoAgenda;
  localizacaoId?: string | null;
  vagaId?: string | null;
  etapaAtualId?: string | null;
  categoria: CategoriaVaga;
  triagem?: TriagemVaga;
  clienteId?: string;
  convidados: string[];
  agendaCandidatura: string[];
};

export type TriagemVaga = {
  id: string;
  ativa: boolean;
  create_at: Date;
  update_at: Date;
  vagaId: string;
  Agenda: Agenda[];
};

@injectable()
export class AgendaService {
  constructor() {}

  async create(agendaData: AgendaInput): Promise<Agenda> {
    agendaData = normalizeDataAgenda(agendaData);
    return await prisma.agenda.create({
      data: {
        titulo: agendaData.titulo,
        dataHora: agendaData.dataHora,
        link: agendaData.link,
        tipoEvento: agendaData.tipoEvento,
        // localizacaoId: agendaData.localizacaoId,
        triagemId: agendaData.vagaId ?? undefined,
        clienteId: agendaData.clienteId ?? undefined,
        convidados: agendaData.convidados ?? [],
        ...(agendaData.agendaCandidatura &&
        agendaData.agendaCandidatura.length > 0
          ? {
              agendaCandidatura: {
                connect: agendaData.agendaCandidatura.map((id) => ({ id })),
              },
            }
          : {}),
      },
    });
  }

  async update(agendaId: string, agendaData: any): Promise<Agenda> {
    return await prisma.agenda.update({
      where: { id: agendaId },
      data: {
        titulo: agendaData.title,
        dataHora: agendaData.dataHora,
        link: agendaData.link,
        tipoEvento: agendaData.tipoEvento,
        localizacaoId: agendaData.localizacaoId,
        triagemId: agendaData.vagaId ?? undefined,
        clienteId: agendaData.clienteId ?? undefined,
        convidados: agendaData.convidados ?? [],
      },
    });
  }

  async delete(agendaId: string): Promise<void> {
    await prisma.agenda.delete({
      where: { id: agendaId },
    });
  }

  async findById(id: string): Promise<Agenda | null> {
    return await prisma.agenda.findUnique({
      where: { id },
      include: {
        triagem: { include: { agenda: true } },
        localizacao: true,
        cliente: true,
        vaga: true,
      },
    });
  }

  async getAll({ page = 1, pageSize = 10 }) {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.agenda.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          dataHora: true,
          tipoEvento: true,
          link: true,
        },
        orderBy: { dataHora: "desc" },
      }),
      prisma.agenda.count(),
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
