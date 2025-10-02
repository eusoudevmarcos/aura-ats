import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";

@injectable()
export class TriagemService {
  constructor() {}

  async getTriagemById(id: string) {
    try {
      const triagem = await prisma.triagemVaga.findUnique({
        where: { id },
        include: {
          vaga: true,
          agenda: true,
        },
      });
      return triagem;
    } catch (error) {
      console.error("Erro ao buscar triagem por ID:", error);
      throw new Error("Não foi possível buscar a triagem.");
    }
  }

  async getAll({
    page = 1,
    pageSize = 10,
    search = {},
  }: {
    page?: number;
    pageSize?: number;
    search?: any;
  }) {
    const skip = (page - 1) * pageSize;

    // Monta o filtro de busca
    let where: any = {};

    // Se search for um objeto, adiciona os filtros
    if (search && typeof search === "object") {
      // Exemplo: search = { status: "PENDENTE" }
      Object.entries(search).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          where[key] = value;
        }
      });
    }

    try {
      const [triagens, total] = await Promise.all([
        prisma.triagemVaga.findMany({
          skip,
          take: pageSize,
          where,
          include: {
            vaga: true,
            agenda: true,
          },
          orderBy: { create_at: "desc" },
        }),
        prisma.triagemVaga.count({ where }),
      ]);

      return {
        data: triagens,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      console.error("Erro ao buscar triagens:", error);
      throw new Error("Não foi possível buscar as triagens.");
    }
  }

  async save(data: any) {
    // Se data.id existe, faz update, senão faz create
    const relations = {
      vaga: true,
      agenda: true,
    };

    try {
      if (!data.id) {
        // CREATE
        const created = await prisma.triagemVaga.create({
          data: {
            ativa: data.ativa ?? true,
            vagaId: data.vagaId,
            // agenda: { create: data.agenda ?? [] }, // Se quiser criar agendas junto
          },
          include: relations,
        });
        return created;
      } else {
        // UPDATE
        const updated = await prisma.triagemVaga.update({
          where: { id: data.id },
          data: {
            ativa: data.ativa,
            vagaId: data.vagaId,
            // Não atualiza agenda aqui, pois é relacional (faria separado)
          },
          include: relations,
        });
        return updated;
      }
    } catch (error: any) {
      console.error("Erro ao salvar triagem:", error);
      throw new Error(error?.message || "Erro ao salvar triagem.");
    }
  }
}
