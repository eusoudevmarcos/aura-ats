import { injectable } from "tsyringe";
import { save } from "../helper/buildSave";
import prisma from "../lib/prisma";
import { VagaSaveInput } from "../types/vaga.type";

import { Prisma } from "@prisma/client";
import { buildWhere } from "../helper/buildWhere";

interface Pagination {
  page?: number;
  pageSize?: number;
  search?: string;
}

@injectable()
export class VagaService {
  constructor() {}

  async saveWithTransaction(vagaData: VagaSaveInput) {
    const {
      id,
      titulo,
      beneficios,
      habilidades,
      anexos,
      localizacao,
      localizacaoId,
      clienteId,
      responsabilidades,
      ...rest
    } = vagaData;

    return await prisma.$transaction(async (tx) => {
      const dataToSave: any = {
        id,
        titulo,
        responsabilidades,
        clienteId: clienteId || undefined,
        localizacao:
          localizacao || (localizacaoId ? { id: localizacaoId } : undefined),
        ...rest,
      };

      // Adiciona benefícios apenas se for um array válido
      if (beneficios && Array.isArray(beneficios) && beneficios.length > 0) {
        dataToSave.beneficios = beneficios;
      }

      // Adiciona habilidades apenas se for um array válido
      if (habilidades && Array.isArray(habilidades) && habilidades.length > 0) {
        dataToSave.habilidades = habilidades;
      }

      // Adiciona anexos apenas se for um array válido
      if (anexos && Array.isArray(anexos) && anexos.length > 0) {
        dataToSave.anexos = anexos;
      }

      const vaga = await save({
        prisma,
        tx,
        model: "vaga",
        idField: "id",
        data: dataToSave,
        relations: {
          // Relação one-to-one com localização
          localizacao: {
            type: "one-to-one",
            validation: {
              uniqueKeys: ["cidade", "uf"],
            },
          },
          // Relação one-to-many com benefícios (Beneficio tem vagaId)
          beneficios: {
            type: "one-to-many",
            validation: {
              uniqueKeys: ["nome"],
            },
          },
          // Relação many-to-many com habilidades (via VagaHabilidade)
          habilidades: {
            type: "many-to-many",
            validation: {
              uniqueKeys: ["nome"],
            },
          },
          // Relação many-to-many com anexos (via VagaAnexo)
          anexos: {
            type: "many-to-many",
            validation: {
              uniqueKeys: ["anexoId"],
            },
          },
        },
        include: {
          localizacao: true,
          beneficios: true,
          habilidades: true,
          anexos: true,
          cliente: true,
        },
      });

      return vaga;
    });
  }

  async getAllByCliente(
    clienteId: string,
    { page = 1, pageSize = 10 }: Pagination
  ) {
    const skip = (page - 1) * pageSize;

    const [vagas, total] = await prisma.$transaction([
      prisma.vaga.findMany({
        where: { clienteId },
        skip,
        orderBy: {
          create_at: "desc",
        },
        take: pageSize,
        include: {
          beneficios: true,
          habilidades: true,
          anexos: true,
          localizacao: true,
        },
      }),
      prisma.vaga.count({ where: { clienteId } }),
    ]);

    return {
      data: vagas,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getAll({ page = 1, pageSize = 10, search = "" }: Pagination) {
    const skip = (page - 1) * pageSize;

    const where = buildWhere<Prisma.VagaWhereInput>(search, [
      "titulo",
      "descricao",
      "localizacao.cidade",
      "localizacao.uf",
      "beneficios.nome",
      "habilidades.nome",
    ]);

    const [vagas, total] = await prisma.$transaction([
      prisma.vaga.findMany({
        skip,
        take: pageSize,
        orderBy: {
          create_at: "desc",
        },
        where,
        include: {
          beneficios: true,
          habilidades: true,
          anexos: true,
          localizacao: true,
        },
      }),
      prisma.vaga.count(),
    ]);

    return {
      data: vagas,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string) {
    const vaga = await prisma.vaga.findUnique({
      where: { id },
      include: {
        beneficios: true,
        habilidades: { include: { habilidade: true } },
        anexos: true,
        localizacao: true,
        cliente: true,
      },
    });

    if (!vaga) {
      throw new Error("Vaga não encontrada.");
    }

    return vaga;
  }
}
