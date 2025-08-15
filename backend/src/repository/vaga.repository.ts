// src/repository/vaga.repository.ts
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { Prisma, Vaga } from "@prisma/client";
import { PrismaTransactionClient } from "../types/prisma.types";

@injectable()
export class VagaRepository {
  async saveWithTransaction(vagaDataRaw: any): Promise<Vaga> {
    return prisma.$transaction(async (tx) => {
      let vaga: Vaga | null = null;
      let createdOrUpdatedVaga: Vaga;

      if (!vagaDataRaw.cliente.id) {
        throw new Error("Cliente ID is required to create or update a vaga.");
      }

      const vagaCoreData: Prisma.VagaCreateInput | Prisma.VagaUpdateInput = {
        titulo: vagaDataRaw.titulo,
        descricao: vagaDataRaw.descricao,
        requisitos: vagaDataRaw.requisitos,
        responsabilidades: vagaDataRaw.responsabilidades,
        salarioMinimo: vagaDataRaw.salarioMinimo,
        salarioMaximo: vagaDataRaw.salarioMaximo,
        categoria: vagaDataRaw.categoria,
        status: vagaDataRaw.status,
        tipoContrato: vagaDataRaw.tipoContrato,
        nivelExperiencia: vagaDataRaw.nivelExperiencia,
        areaCandidato: vagaDataRaw.areaCandidato,
        cliente: { connect: { id: vagaDataRaw.cliente.id } },
      };

      if (vagaDataRaw.id) {
        // Update existing Vaga
        vaga = await tx.vaga.update({
          where: { id: vagaDataRaw.id },
          data: vagaCoreData as Prisma.VagaUpdateInput,
        });
      } else {
        // Create new Vaga
        vaga = await tx.vaga.create({
          data: vagaCoreData as Prisma.VagaCreateInput,
        });
      }

      if (!vaga) {
        throw new Error("Failed to create or update vaga.");
      }

      // Step 2: Handle Localizacao (if provided, for both create and update)
      if (vagaDataRaw.localizacao) {
        if (vagaDataRaw.localizacao.id) {
          // Update existing location
          await tx.localizacao.update({
            where: { id: vagaDataRaw.localizacao.id },
            data: vagaDataRaw.localizacao,
          });
        } else {
          // Create new location and connect to vaga
          const newLocation = await tx.localizacao.create({
            data: vagaDataRaw.localizacao,
          });
          await tx.vaga.update({
            where: { id: vaga.id },
            data: { localizacao: { connect: { id: newLocation.id } } },
          });
        }
      } else if (vagaDataRaw.localizacao.id) {
        // Only connect existing location if no new data provided
        await tx.vaga.update({
          where: { id: vaga.id },
          data: {
            localizacao: { connect: { id: vagaDataRaw.localizacao.id } },
          },
        });
      }

      // Step 3: Handle ProcessoSeletivoEtapa
      let createdProcessoEtapas: { id: string; ordem: number }[] = [];
      if (
        vagaDataRaw.ProcessoSeletivoEtapa &&
        vagaDataRaw.ProcessoSeletivoEtapa.length > 0
      ) {
        if (vagaDataRaw.id) {
        }
        const createdStages = await Promise.all(
          vagaDataRaw.ProcessoSeletivoEtapa.map(async (etapa: any) => {
            return await tx.processoSeletivoEtapa.create({
              data: {
                ...etapa,
                vaga: { connect: { id: vaga.id } },
              },
            });
          })
        );
        createdProcessoEtapas = createdStages.map((s) => ({
          id: s.id,
          ordem: s.ordem,
        }));
      }

      // Step 4: Handle EventosAgenda
      if (vagaDataRaw.eventosAgenda && vagaDataRaw.eventosAgenda.length > 0) {
        if (vagaDataRaw.id) {
          // Clear existing events for update (assuming replacement)
          await tx.agendaVaga.deleteMany({
            where: { vagaId: vaga.id },
          });
        }
        await Promise.all(
          vagaDataRaw.eventosAgenda.map(async (eventoRaw: any) => {
            let localizacaoConnectOrCreate;
            if (eventoRaw.localizacao.id) {
              localizacaoConnectOrCreate = {
                connect: { id: eventoRaw.localizacao.id },
              };
            } else if (eventoRaw.localizacao) {
              localizacaoConnectOrCreate = { create: eventoRaw.localizacao };
            }

            let etapaAtualConnect;
            if (eventoRaw.etapaAtualId) {
              etapaAtualConnect = { connect: { id: eventoRaw.etapaAtualId } };
            } else if (eventoRaw.ordem !== undefined) {
              const matchingEtapa = createdProcessoEtapas.find(
                (e) => e.ordem === eventoRaw.ordem
              );
              if (matchingEtapa) {
                etapaAtualConnect = { connect: { id: matchingEtapa.id } };
              }
            }

            await tx.agendaVaga.create({
              data: {
                dataHora: eventoRaw.dataHora,
                tipoEvento: eventoRaw.tipoEvento,
                link: eventoRaw.link,
                vaga: { connect: { id: vaga.id } },
                localizacao: localizacaoConnectOrCreate,
                etapaAtual: etapaAtualConnect,
              },
            });
          })
        );
      }

      // Step 5: Handle Habilidades (Many-to-Many via VagaHabilidade)
      if (vagaDataRaw.habilidades && vagaDataRaw.habilidades.length > 0) {
        if (vagaDataRaw.id) {
          await tx.vagaHabilidade.deleteMany({ where: { vagaId: vaga.id } });
        }
        await Promise.all(
          vagaDataRaw.habilidades.map(async (vh: any) => {
            const connectOrCreateHabilidade = vh.habilidadeId
              ? { connect: { id: vh.habilidadeId } }
              : {
                  create: {
                    nome: vh.habilidade!.nome,
                    tipoHabilidade: vh.habilidade!.tipoHabilidade,
                  },
                };

            await tx.vagaHabilidade.create({
              data: {
                vaga: { connect: { id: vaga.id } },
                nivelExigido: vh.nivelExigido,
                habilidade: connectOrCreateHabilidade,
              },
            });
          })
        );
      }

      // Step 6: Handle Beneficios (Many-to-Many via VagaBeneficio)
      if (vagaDataRaw.beneficios && vagaDataRaw.beneficios.length > 0) {
        if (vagaDataRaw.id) {
          await tx.beneficio.deleteMany({ where: { vagaId: vaga.id } });
        }
        await Promise.all(
          vagaDataRaw.beneficios.create({
            create: vagaDataRaw.beneficio,
          })
        );
      }

      // Step 7: Handle Anexos (Many-to-Many via VagaAnexo)
      if (vagaDataRaw.anexos && vagaDataRaw.anexos.length > 0) {
        if (vagaDataRaw.id) {
          await tx.vagaAnexo.deleteMany({ where: { vagaId: vaga.id } });
        }
        await Promise.all(
          vagaDataRaw.anexos.map(async (va: any) => {
            const connectOrCreateAnexo = va.anexoId
              ? { connect: { id: va.anexoId } }
              : {
                  create: {
                    nomeArquivo: va.anexo!.nomeArquivo,
                    url: va.anexo!.url,
                    tipo: va.anexo?.tipo,
                    tamanhoKb: va.anexo?.tamanhoKb,
                  },
                };

            await tx.vagaAnexo.create({
              data: {
                vaga: { connect: { id: vaga.id } },
                anexo: connectOrCreateAnexo,
              },
            });
          })
        );
      }

      // Return the complete Vaga object with all relations
      createdOrUpdatedVaga = await tx.vaga.findUniqueOrThrow({
        where: { id: vaga.id },
        include: {
          cliente: { include: { empresa: true } },
          localizacao: true,
          agendaVaga: { include: { localizacao: true, etapaAtual: true } },
          beneficios: true,
          habilidades: { include: { habilidade: true } },
          anexos: { include: { anexo: true } },
        },
      });

      return createdOrUpdatedVaga;
    });
  }

  async findById(id: string): Promise<Vaga | null> {
    return await prisma.vaga.findUnique({
      where: { id },
      include: {
        cliente: { include: { empresa: true } },
        localizacao: true,
        agendaVaga: { include: { localizacao: true } },
        beneficios: true,
        habilidades: { include: { habilidade: true } },
        anexos: { include: { anexo: true } },
      },
    });
  }

  async findByIdWithTransaction(
    id: string,
    tx: PrismaTransactionClient
  ): Promise<Vaga | null> {
    return await tx.vaga.findUnique({
      where: { id },
      include: {
        cliente: { include: { empresa: true } },
        localizacao: true,
        agendaVaga: { include: { localizacao: true } },
        beneficios: true,
        habilidades: { include: { habilidade: true } },
        anexos: { include: { anexo: true } },
      },
    });
  }

  async findAll(
    page: number,
    pageSize: number
  ): Promise<{ data: Vaga[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      prisma.vaga.findMany({
        skip,
        take: pageSize,
        include: {
          cliente: { include: { empresa: true } },
          localizacao: true,
          agendaVaga: true,
          beneficios: true,
          habilidades: { include: { habilidade: true } },
          anexos: { include: { anexo: true } },
        },
      }),
      prisma.vaga.count(),
    ]);
    return { data, total };
  }

  async deleteWithTransaction(
    id: string,
    tx: PrismaTransactionClient
  ): Promise<Vaga> {
    return await tx.vaga.delete({
      where: { id },
      include: {
        cliente: { include: { empresa: true } },
        localizacao: true,
        agendaVaga: { include: { localizacao: true } },
        beneficios: true,
        habilidades: { include: { habilidade: true } },
        anexos: { include: { anexo: true } },
      },
    });
  }
}
