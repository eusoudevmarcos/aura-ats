import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { VagaSaveInput } from "../types/vaga.type";

import { Prisma, Vaga } from "@prisma/client";
import { buildVagaData } from "../helper/buildNested/vaga.build";
import { buildWhere } from "../helper/buildWhere";
import { normalizeData } from "../helper/normalize/vaga.normalize";
import { Pagination } from "../types/pagination";

@injectable()
export class VagaService {
  constructor() {}

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

    const where = buildWhere<Prisma.VagaWhereInput>({
      search,
      fields: [
        "titulo",
        "cliente.empresa.cnpj",
        "descricao",
        "localizacao.cidade",
        "localizacao.uf",
      ],
    });

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
          cliente: true,
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

  async getAllByUsuario({
    page = 1,
    pageSize = 10,
    search = "",
    usuarioId,
  }: Pagination & { usuarioId: string }) {
    const skip = (page - 1) * pageSize;

    const where = buildWhere<Prisma.VagaWhereInput>(
      {
        search: search,
        fields: [
          "titulo",
          "descricao",
          "cliente.empresa.cpnj",
          "localizacao.cidade",
          "localizacao.uf",
          "localizacao.cidade",
          "create_at",
          "cliente.empresa.usuarioSistema.id",
        ],
      },
      {
        search: usuarioId,
        fields: ["cliente.empresa.usuarioSistema.id"],
      }
    );

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
          habilidades: { include: { habilidade: true } },
          anexos: true,
          localizacao: true,
          cliente: {
            include: {
              empresa: {
                include: { usuarioSistema: true },
              },
            },
          },
        },
      }),
      prisma.vaga.count({ where }),
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
        cliente: { include: { empresa: true } },
        candidatos: {
          select: {
            pessoa: {
              select: {
                nome: true,
              },
            },
            id: true,
            crm: true,
            areaCandidato: true,
            rqe: true,
            especialidade: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    if (!vaga) {
      throw new Error("Vaga não encontrada.");
    }

    return vaga;
  }

  async save(vagaData: VagaSaveInput): Promise<Vaga> {
    const normalizedData = normalizeData(vagaData);
    if (!vagaData?.id) {
      await this.checkDuplicates(normalizedData);
    }

    const vagaPayload = await buildVagaData(normalizedData);

    const relationsShip = {
      localizacao: true,
      beneficios: true,
      habilidades: true,
      anexos: true,
      cliente: { include: { empresa: true } },
    };

    if (vagaData?.id) {
      return await prisma.vaga.update({
        where: { id: vagaData.id },
        data: vagaPayload,
        include: relationsShip,
      });
    } else {
      return await prisma.vaga.create({
        data: vagaPayload,
        include: relationsShip,
      });
    }
  }

  async vincularCandidatos(id: string, candidatos: string[]) {
    if (!id || !Array.isArray(candidatos) || candidatos.length === 0) {
      throw new Error("ID da vaga e lista de candidatos são obrigatórios.");
    }

    // Busca os IDs dos candidatos já vinculados à vaga
    const vagaExistente = await prisma.vaga.findUnique({
      where: { id },
      select: { candidatos: { select: { id: true } } },
    });

    if (!vagaExistente) {
      throw new Error("Vaga não encontrada.");
    }

    const idsJaVinculados = vagaExistente.candidatos.map((c) => c.id);

    // Filtra apenas os candidatos que ainda não estão vinculados
    const novosCandidatos = candidatos.filter(
      (candidatoId) => !idsJaVinculados.includes(candidatoId)
    );

    // Se não houver novos candidatos para vincular, apenas retorna a vaga atualizada
    if (novosCandidatos.length === 0) {
      return await prisma.vaga.findUnique({
        where: { id },
        include: {
          beneficios: true,
          habilidades: { include: { habilidade: true } },
          anexos: true,
          localizacao: true,
          cliente: { include: { empresa: true } },
          candidatos: true,
        },
      });
    }

    // Conecta apenas os novos candidatos (upsert-like)
    const vagaAtualizada = await prisma.vaga.update({
      where: { id },
      data: {
        candidatos: {
          connect: novosCandidatos.map((candidatoId) => ({ id: candidatoId })),
        },
      },
      include: {
        beneficios: true,
        habilidades: { include: { habilidade: true } },
        anexos: true,
        localizacao: true,
        cliente: { include: { empresa: true } },
        candidatos: true,
      },
    });

    return vagaAtualizada;
  }

  private async checkDuplicates(data: any): Promise<void> {
    if (data.clienteId) {
      const clienteExistente = await prisma.cliente.findUnique({
        where: { id: data.clienteId },
      });

      if (!clienteExistente) {
        throw new Error(`Cliente com ID ${data.clienteId} não encontrado.`);
      }
    }

    if (data.localizacaoId) {
      const localizacaoExistente = await prisma.localizacao.findUnique({
        where: { id: data.localizacaoId },
      });

      if (!localizacaoExistente) {
        throw new Error(
          `Localização com ID ${data.localizacaoId} não encontrada.`
        );
      }
    }

    // Verificar duplicata de título para o mesmo cliente (opcional)
    if (data.titulo && data.clienteId) {
      const vagaExistente = await prisma.vaga.findFirst({
        where: {
          titulo: data.titulo,
          clienteId: data.clienteId,
          NOT: data.id ? { id: data.id } : undefined,
        },
      });

      if (vagaExistente) {
        throw new Error(
          `Já existe uma vaga com o título "${data.titulo}" para este cliente.`
        );
      }
    }
  }
}
