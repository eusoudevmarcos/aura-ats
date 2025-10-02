import { Cliente, Prisma } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { BuildNestedOperation } from "../helper/buildNested/buildNestedOperation";
import { buildClienteData } from "../helper/buildNested/cliente.build";
import { buildWhere } from "../helper/buildWhere";
import { normalizeClienteData } from "../helper/normalize/cliente.normalize";
import { validateBasicFieldsCliente } from "../helper/validate/cliente.validate";
import prisma from "../lib/prisma";
import { EmpresaRepository } from "../repository/empresa.repository";
import { Pagination } from "../types/pagination";

@injectable()
export class ClienteService extends BuildNestedOperation {
  constructor(
    @inject(EmpresaRepository) private empresaRepository: EmpresaRepository
  ) {
    super();
  }

  async getClienteById(id: string): Promise<Cliente | null> {
    return await prisma.cliente.findUnique({
      where: { id },
      include: {
        empresa: {
          include: {
            contatos: true,
            localizacoes: true,
            representantes: true,
            socios: true,
          },
        },
        // vagas: {
        //   select: {
        //     id: true,
        //     titulo: true,
        //     categoria: true,
        //     dataPublicacao: true,
        //     status: true,
        //     _count: {
        //       select: {
        //         candidaturas: true,
        //       },
        //     },
        //   },
        // },
      },
    });
  }

  async getAll({ page = 1, pageSize = 10, search }: Pagination<any>) {
    const skip = (page - 1) * pageSize;

    // const where = {
    //   status: { equals: search?.status },
    //   empresa: {
    //     razaoSocial: { contains: search?.razaoSocial, mode: "insensitive" },
    //   },
    // };

    let where = buildWhere<Prisma.ClienteWhereInput>({
      search,
      fields: ["empresa.razaoSocial"],
    });

    const [vagas, total] = await prisma.$transaction([
      prisma.cliente.findMany({
        skip,
        take: pageSize,
        orderBy: {
          empresa: {
            createdAt: "desc",
          },
        },
        where: where,
        select: {
          tipoServico: true,
          status: true,
          empresa: {
            select: {
              razaoSocial: true,
              cnpj: true,
              dataAbertura: true,
            },
          },
          usuarioSistema: {
            select: {
              email: true,
            },
          },
        },
      }),
      prisma.cliente.count({ where }),
    ]);

    return {
      data: vagas,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async save(clienteData: any): Promise<Cliente> {
    validateBasicFieldsCliente(clienteData);

    const normalizedData = normalizeClienteData(clienteData);

    if (!clienteData.id) {
      await this.checkDuplicates(normalizedData);
    }

    const clientePayload = await buildClienteData(normalizedData);

    const relations = {
      empresa: {
        include: {
          contatos: true,
          localizacoes: true,
          representantes: true,
          socios: true,
        },
      },
    };

    if (clienteData.id) {
      return await prisma.cliente.update({
        where: { id: clienteData.id },
        data: clientePayload,
        include: relations,
      });
    } else {
      return await prisma.cliente.create({
        data: clientePayload,
        include: relations,
      });
    }
  }

  private async checkDuplicates(data: any): Promise<void> {
    // Se tem empresaId, verificar se a empresa existe
    if (data.empresaId) {
      const empresaExistente = await prisma.empresa.findUnique({
        where: { id: data.empresaId },
      });

      if (!empresaExistente) {
        throw new Error(`Empresa com ID ${data.empresaId} não encontrada.`);
      }

      // Verificar se já existe cliente para essa empresa
      const clienteExistente = await prisma.cliente.findUnique({
        where: { empresaId: data.empresaId },
      });

      if (clienteExistente) {
        throw new Error(
          `Já existe um cliente associado à empresa com ID: ${data.empresaId}`
        );
      }
    }

    // Se tem dados da empresa para criar/atualizar
    if (data.empresa?.cnpj) {
      const empresaExistentePorCnpj = await prisma.empresa.findUnique({
        where: { cnpj: data.empresa.cnpj },
      });

      if (empresaExistentePorCnpj) {
        // Se a empresa existe, verificar se já tem cliente
        const clienteExistente = await prisma.cliente.findUnique({
          where: { empresaId: empresaExistentePorCnpj.id },
        });

        if (clienteExistente) {
          throw new Error(
            `Já existe um cliente para a empresa com CNPJ: ${data.empresa.cnpj}`
          );
        }
      }
    }
  }
}
