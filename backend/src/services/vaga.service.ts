import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { VagaSaveInput } from "../types/vaga.type";

import { Prisma, Vaga } from "@prisma/client";
import { buildVagaData } from "../helper/buildNested/vaga.build";
import { buildWhere } from "../helper/buildWhere";
import { normalizeData } from "../helper/normalize/vaga.normalize";
import { validateBasicFields } from "../helper/validate/vaga.validate";
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
    const fields = [
      "titulo",
      "descricao",
      "localizacao.cidade",
      "localizacao.uf",
      "create_at",
    ];

    const where = buildWhere<Prisma.VagaWhereInput>(search, [
      "titulo",
      "descricao",
      "localizacao.cidade",
      "localizacao.uf",
      "localizacao.cidade",
      "create_at",
      // "beneficios.nome",
      // "habilidades.nome",
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

  async save(vagaData: VagaSaveInput): Promise<Vaga> {
    validateBasicFields(vagaData);

    const normalizedData = normalizeData(vagaData);
    if (!vagaData.id) {
      await this.checkDuplicates(normalizedData);
    }

    const vagaPayload = await buildVagaData(normalizedData);

    const relationsShip = {
      localizacao: true,
      beneficios: true,
      habilidades: true,
      anexos: true,
      cliente: true,
    };

    if (!vagaData.id) {
      return await prisma.vaga.create({
        data: vagaPayload,
        include: relationsShip,
      });
    } else {
      return await prisma.vaga.update({
        where: { id: vagaData.id },
        data: vagaPayload,
        include: relationsShip,
      });
    }
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
