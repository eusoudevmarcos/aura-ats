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
          _count: {
            select: {
              candidaturas: true,
            },
          },
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

  async getAllByCandidato(
    candidatoId: string,
    { page = 1, pageSize = 10 }: Pagination
  ) {
    const skip = (page - 1) * pageSize;

    // Busca vagas onde o candidato tem candidaturas
    const [vagas, total] = await prisma.$transaction([
      prisma.vaga.findMany({
        where: {
          candidaturas: {
            some: {
              candidatoId: candidatoId,
            },
          },
        },
        skip,
        orderBy: {
          create_at: "desc",
        },
        take: pageSize,
      }),
      prisma.vaga.count({
        where: {
          candidaturas: {
            some: {
              candidatoId: candidatoId,
            },
          },
        },
      }),
    ]);

    return {
      data: vagas,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getAll({
    page = 1,
    pageSize = 10,
    search = "",
    clienteId,
  }: Pagination & { clienteId?: string }) {
    const skip = (page - 1) * pageSize;

    // Monta o where base para pesquisa textual
    let where = buildWhere<Prisma.VagaWhereInput>({
      search,
      fields: [
        "titulo",
        "cliente.empresa.cnpj",
        "descricao",
        "localizacao.cidade",
        "localizacao.uf",
      ],
    });

    if (clienteId) {
      if (where.OR) {
        where = {
          AND: [{ cliente: { id: clienteId } }, { ...where }],
        };
      } else {
        where = {
          ...where,
          cliente: { id: clienteId },
        };
      }
    }

    const select = {
      id: true,
      titulo: true,
      categoria: true,
      status: true,
      dataPublicacao: true,
      localizacao: {
        select: {
          uf: true,
          cidade: true,
        },
      },
    };

    const [vagas, total] = await prisma.$transaction([
      prisma.vaga.findMany({
        skip,
        take: pageSize,
        orderBy: {
          create_at: "desc",
        },
        where,
        select,
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
              usuarioSistema: true,
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
        candidaturas: {
          include: {
            candidato: {
              select: {
                id: true,
                crm: true,
                areaCandidato: true,
                rqe: true,
                pessoa: {
                  select: {
                    nome: true,
                  },
                },
                especialidade: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!vaga) {
      throw new Error("Vaga não encontrada.");
    }

    // Transforma candidaturas em array simples de candidatos
    const candidatos = vaga.candidaturas.map(
      (candidatura) => candidatura.candidato
    );

    // Retorna a vaga com candidatos como array simples
    const { candidaturas, ...vagaSemCandidaturas } = vaga;

    return {
      ...vagaSemCandidaturas,
      candidatos,
    };
  }

  async save(vagaData: VagaSaveInput): Promise<Vaga> {
    const normalizedData = normalizeData(vagaData);
    if (!vagaData?.id) {
      await this.checkDuplicates(normalizedData);
    }

    // separar triagens para sincronizar manualmente e garantir no máximo 4 e sem duplicatas
    const triagensInput = Array.isArray(normalizedData.triagens)
      ? Array.from(
          new Map(
            normalizedData.triagens
              .filter((t: any) => !!t && !!t.tipoTriagem)
              .slice(0, 4)
              .map((t: any) => [
                t.tipoTriagem,
                { tipoTriagem: t.tipoTriagem, ativa: t.ativa ?? true },
              ])
          ).values()
        )
      : [];

    const vagaPayload = await buildVagaData({
      ...normalizedData,
      triagens: undefined,
    });

    const relationsShip = {
      localizacao: true,
      beneficios: true,
      habilidades: true,
      anexos: true,
      cliente: {
        include: {
          empresa: {
            include: { localizacoes: true },
          },
        },
      },
      triagens: true,
    };

    let saved: Vaga;
    if (vagaData?.id) {
      saved = await prisma.vaga.update({
        where: { id: vagaData.id },
        data: vagaPayload,
        include: relationsShip,
      });
    } else {
      saved = await prisma.vaga.create({
        data: vagaPayload,
        include: relationsShip,
      });
    }

    // sincronizar triagens somente se houver entrada explícita
    if (triagensInput.length) {
      await this.syncTriagens(saved.id, triagensInput as any[]);
      // recarregar vaga com triagens atualizadas
      saved = (await prisma.vaga.findUnique({
        where: { id: saved.id },
        include: relationsShip,
      })) as Vaga;
    }

    return saved;
  }

  async vincularCandidatos(id: string, candidatos: string[]) {
    if (!id || !Array.isArray(candidatos) || candidatos.length === 0) {
      throw new Error("ID da vaga e lista de candidatos são obrigatórios.");
    }

    // Busca os IDs dos candidatos já vinculados à vaga
    const vagaExistente = await prisma.vaga.findUnique({
      where: { id },
      select: {
        candidaturas: {
          select: {
            candidatoId: true,
          },
        },
      },
    });

    if (!vagaExistente) {
      throw new Error("Vaga não encontrada.");
    }

    // Corrigido: extrair os candidatoIds das candidaturas existentes
    const idsJaVinculados = vagaExistente.candidaturas.map(
      (candidatura) => candidatura.candidatoId
    );

    const novosCandidatos = candidatos.filter(
      (candidatoId) => !idsJaVinculados.includes(candidatoId)
    );

    if (novosCandidatos.length === 0) {
      return await prisma.vaga.findUnique({
        where: { id },
        include: {
          beneficios: true,
          habilidades: { include: { habilidade: true } },
          anexos: true,
          localizacao: true,
          cliente: { include: { empresa: true } },
          candidaturas: { include: { candidato: true } },
        },
      });
    }

    await prisma.$transaction(
      novosCandidatos.map((candidatoId) =>
        prisma.candidaturaVaga.create({
          data: {
            vagaId: id,
            candidatoId: candidatoId,
          },
        })
      )
    );

    const vagaAtualizada = await prisma.vaga.findUnique({
      where: { id },
      include: {
        beneficios: true,
        habilidades: { include: { habilidade: true } },
        anexos: true,
        localizacao: true,
        cliente: { include: { empresa: true } },
        candidaturas: { include: { candidato: true } },
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

  private async syncTriagens(
    vagaId: string,
    triagens: { tipoTriagem: string; ativa?: boolean }[]
  ): Promise<void> {
    const existing = await prisma.triagemVaga.findMany({
      where: { vagaId },
    });

    const desiredByTipo = new Map(
      triagens.slice(0, 4).map((t) => [t.tipoTriagem, t])
    );
    const existingByTipo = new Map(
      existing.map((e) => [e.tipoTriagem as string, e])
    );

    const toDelete = existing.filter(
      (e) => !desiredByTipo.has(e.tipoTriagem as string)
    );
    const toCreate = Array.from(desiredByTipo.entries())
      .filter(([tipo]) => !existingByTipo.has(tipo))
      .map(([, t]) => t);
    const toUpdate = existing
      .filter((e) => desiredByTipo.has(e.tipoTriagem as string))
      .map((e) => ({
        id: e.id,
        ativa: desiredByTipo.get(e.tipoTriagem as string)?.ativa ?? true,
      }));

    await prisma.$transaction([
      ...toDelete.map((e) =>
        prisma.triagemVaga.delete({ where: { id: e.id } })
      ),
      ...toCreate.map((t) =>
        prisma.triagemVaga.create({
          data: {
            vagaId,
            tipoTriagem: t.tipoTriagem as any,
            ativa: t.ativa ?? true,
          },
        })
      ),
      ...toUpdate.map((u) =>
        prisma.triagemVaga.update({
          where: { id: u.id },
          data: { ativa: u.ativa },
        })
      ),
    ]);
  }
}
