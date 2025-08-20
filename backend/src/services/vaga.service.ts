import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import {
  BeneficioInput,
  VagaAnexoInput,
  VagaHabilidadeInput,
  VagaSaveInput,
} from "../types/vaga.type";

import { Beneficio, Prisma, VagaAnexo, VagaHabilidade } from "@prisma/client";

interface Pagination {
  page?: number;
  pageSize?: number;
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
      if (titulo && clienteId) {
        const tituloExiste = await tx.vaga.findFirst({
          where: {
            titulo: titulo,
            clienteId: clienteId,
            NOT: id ? { id } : undefined,
          },
        });

        if (tituloExiste) {
          throw new Error(
            "Já existe uma vaga com este título para este cliente."
          );
        }
      }

      let localizacaoConnectOrCreateOrUpdate:
        | Prisma.LocalizacaoCreateNestedOneWithoutVagaInput
        | Prisma.LocalizacaoUpdateOneWithoutVagaNestedInput
        | undefined;

      if (localizacao?.id) {
        localizacaoConnectOrCreateOrUpdate = {
          upsert: {
            create: localizacao as Prisma.LocalizacaoCreateWithoutVagaInput,
            update: localizacao as Prisma.LocalizacaoUpdateWithoutVagaInput,
            where: { id: localizacao.id },
          },
        };
      } else if (localizacao) {
        localizacaoConnectOrCreateOrUpdate = {
          create: localizacao as Prisma.LocalizacaoCreateWithoutVagaInput,
        };
      } else if (localizacaoId) {
        localizacaoConnectOrCreateOrUpdate = {
          connect: { id: localizacaoId },
        };
      }

      const vaga = id
        ? await tx.vaga.update({
            where: { id },
            data: {
              titulo,
              responsabilidades,
              ...rest,
              cliente: clienteId ? { connect: { id: clienteId } } : undefined,
              localizacao: localizacaoConnectOrCreateOrUpdate,
            },
            include: {
              beneficios: true,
              habilidades: true,
              anexos: true,
              localizacao: true,
              cliente: true,
            },
          })
        : await tx.vaga.create({
            data: {
              titulo,
              // 'dataPublicacao' pode ser omitida se @default(now()) no schema
              ...rest,
              cliente: clienteId ? { connect: { id: clienteId } } : undefined,
              localizacao: localizacaoConnectOrCreateOrUpdate,
            },
            include: {
              beneficios: true,
              habilidades: true,
              anexos: true,
              localizacao: true,
              cliente: true,
            },
          });

      if (beneficios !== undefined) {
        await tx.beneficio.deleteMany({ where: { vagaId: vaga.id } });
        if (beneficios.length > 0) {
          await tx.beneficio.createMany({
            data: beneficios.map((b: BeneficioInput) => ({
              nome: b.nome,
              descricao: b.descricao,
              vagaId: vaga.id,
            })),
          });
        }
      }

      if (habilidades !== undefined) {
        await tx.vagaHabilidade.deleteMany({ where: { vagaId: vaga.id } });
        if (habilidades.length > 0) {
          const vagaHabilidadesData = [];
          for (const hInput of habilidades) {
            const habilidade = await tx.habilidade.upsert({
              where: { nome: hInput.nome },
              update: { tipoHabilidade: hInput.tipoHabilidade },
              create: {
                nome: hInput.nome,
                tipoHabilidade: hInput.tipoHabilidade,
              },
            });
            console.log(habilidade);
            vagaHabilidadesData.push({
              vagaId: vaga.id,
              habilidadeId: habilidade.id,
              nivelExigido: hInput.nivelExigido ?? undefined,
            });
          }
          await tx.vagaHabilidade.createMany({
            data: vagaHabilidadesData,
          });
        }
      }

      if (anexos !== undefined) {
        await tx.vagaAnexo.deleteMany({ where: { vagaId: vaga.id } });
        if (anexos.length > 0) {
          await tx.vagaAnexo.createMany({
            data: anexos.map((a: VagaAnexoInput) => ({
              vagaId: vaga.id,
              anexoId: a.anexoId,
            })),
          });
        }
      }

      const finalVaga = await tx.vaga.findUnique({
        where: { id: vaga.id },
        include: {
          cliente: true,
          localizacao: true,
          beneficios: true,
          habilidades: { include: { habilidade: true } },
          anexos: { include: { anexo: true } },
        },
      });

      if (!finalVaga) {
        throw new Error("Erro ao recuperar a vaga após a transação.");
      }

      return finalVaga;
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
        take: pageSize,
        include: {
          beneficios: true,
          habilidades: true,
          anexos: true,
          localizacao: true,
          //   areaCandidato: true,
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

  /**
   * Busca todas as vagas do sistema com paginação
   */
  async getAll({ page = 1, pageSize = 10 }: Pagination) {
    const skip = (page - 1) * pageSize;

    const [vagas, total] = await prisma.$transaction([
      prisma.vaga.findMany({
        skip,
        take: pageSize,
        include: {
          beneficios: true,
          habilidades: true,
          anexos: true,
          localizacao: true,
          //   areaCandidato: true,
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

  /**
   * Busca vaga por ID
   */
  async getById(id: string) {
    const vaga = await prisma.vaga.findUnique({
      where: { id },
      include: {
        beneficios: true,
        habilidades: { include: { habilidade: true } },
        anexos: true,
        localizacao: true,
        cliente: true,
        // areaCandidato: true,
      },
    });

    if (!vaga) {
      throw new Error("Vaga não encontrada.");
    }

    return vaga;
  }
}
