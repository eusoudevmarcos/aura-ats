import { Cliente, StatusCliente, TipoServico } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { EmpresaRepository } from "../repository/empresa.repository";
import { Pagination } from "../types/pagination";
import { buildNestedOperation } from "../utils/buildNestedOperation";

@injectable()
export class ClienteService extends buildNestedOperation {
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
      },
    });
  }

  async getAll({
    page = 1,
    pageSize = 10,
    search,
  }: Pagination<{
    status?: StatusCliente;
    cpf?: string;
    razaoSocial?: string;
  }>) {
    const skip = (page - 1) * pageSize;

    const [vagas, total] = await prisma.$transaction([
      prisma.cliente.findMany({
        skip,
        take: pageSize,
        orderBy: {
          empresa: {
            createdAt: "desc",
          },
        },
        where: {
          status: { equals: search?.status },
          empresa: {
            razaoSocial: { contains: search?.razaoSocial, mode: "insensitive" },
          },
        },
        include: {
          empresa: true,
        },
      }),
      prisma.cliente.count(),
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
    // Validações básicas antes de processar
    this.validateBasicFields(clienteData);

    // Normalizar dados
    const normalizedData = this.normalizeData(clienteData);

    // Validações de duplicatas se for criação
    if (!clienteData.id) {
      await this.checkDuplicates(normalizedData);
    }

    // Construir dados para salvamento
    const clientePayload = await this.buildClienteData(normalizedData);
    console.log(clientePayload);
    // Executar operação de criação ou atualização
    if (clienteData.id) {
      return await prisma.cliente.update({
        where: { id: clienteData.id },
        data: clientePayload,
        include: this.getIncludeRelations(),
      });
    } else {
      return await prisma.cliente.create({
        data: clientePayload,
        include: this.getIncludeRelations(),
      });
    }
  }

  private validateBasicFields(data: any): void {
    if (!data.empresa && !data.empresaId) {
      throw new Error(
        "Dados da empresa (ID ou objeto) são obrigatórios para um cliente."
      );
    }

    if (!data.status) {
      throw new Error("Status é obrigatório.");
    }

    if (
      !data.tipoServico ||
      !Array.isArray(data.tipoServico) ||
      data.tipoServico.length === 0
    ) {
      throw new Error(
        "Tipo de serviço é obrigatório e deve ser um array não vazio."
      );
    }

    // Validação específica para criação de nova empresa
    if (!data.id && data.empresa && !data.empresaId) {
      if (
        !data.empresa.representantes ||
        data.empresa.representantes.length === 0
      ) {
        throw new Error(
          "Ao criar uma nova empresa, é obrigatório informar pelo menos um representante."
        );
      }
    }
  }

  private normalizeData(data: any) {
    return {
      ...data,
      empresa: data.empresa
        ? {
            ...data.empresa,
            cnpj: data.empresa.cnpj?.replace(/\D/g, ""),
            representantes: data.empresa.representantes?.map((rep: any) => ({
              ...rep,
              cpf: rep.cpf?.replace(/\D/g, ""),
            })),
          }
        : undefined,
    };
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

  private async buildClienteData(data: any): Promise<any> {
    const clienteData: any = {
      status: data.status as StatusCliente,
      tipoServico: data.tipoServico as TipoServico[],
    };

    if (data.empresaId) {
      // Se já tem o ID da empresa explícito, só conecta
      clienteData.empresa = { connect: { id: data.empresaId } };
    }

    if (data.empresa) {
      // Usa o helper genérico
      delete data.empresa.representantes;
      clienteData.empresa = this.buildNestedOperation(data.empresa);

      // Nested de contatos
      // if (data.empresa.contatos) {
      //   clienteData.empresa.contatos = this.buildNestedOperation(
      //     data.empresa.contatos
      //   );
      // }

      // Nested de representantes
      if (data.empresa.representantes) {
        clienteData.empresa.representantes = this.buildNestedOperation(
          data.empresa.representantes
        );
      }

      // Nested de localizações
      // if (data.empresa.localizacoes) {
      //   clienteData.empresa.localizacoes = this.buildNestedOperation(
      //     data.empresa.localizacoes
      //   );
      // }
    }

    return clienteData;
  }

  private getIncludeRelations() {
    return {
      empresa: {
        include: {
          contatos: true,
          localizacoes: true,
          representantes: true,
          socios: true,
        },
      },
    };
  }
}
