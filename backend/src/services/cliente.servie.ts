import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { EmpresaRepository } from "../repository/empresa.repository";
import { StatusCliente, TipoServico, Empresa, Cliente } from "@prisma/client";

@injectable()
export class ClienteService {
  constructor(
    @inject(EmpresaRepository) private empresaRepository: EmpresaRepository
  ) {}

  async save(clienteData: any): Promise<Cliente> {
    const { id, empresa, empresaId, status, tipoServico } = clienteData;

    if (!empresa && !empresaId) {
      throw new Error(
        "Dados da empresa (ID ou objeto de criação) são obrigatórios para um cliente."
      );
    }

    let empresaFinal: Empresa;

    if (empresaId) {
      const existingEmpresa = await this.empresaRepository.findById(
        empresaId as string
      );

      if (!existingEmpresa) {
        throw new Error(`Empresa com ID ${empresaId} não encontrada.`);
      }

      if (empresa && empresa.id === empresaId) {
        empresaFinal = await this.empresaRepository.save({
          ...empresa,
          id: empresaId,
        });
      } else {
        empresaFinal = existingEmpresa;
      }
    } else if (empresa) {
      if (
        !id &&
        (!empresa.representantes || empresa.representantes.length === 0)
      ) {
        throw new Error(
          "Ao criar uma nova empresa para o cliente, é obrigatório informar pelo menos um representante."
        );
      }

      const CNPJExiste = await this.empresaRepository.findByCnpj(empresa.cnpj);

      if (CNPJExiste) {
        empresaFinal = await this.empresaRepository.save({
          ...empresa,
          id: CNPJExiste.id,
        });
      } else {
        empresaFinal = await this.empresaRepository.save(empresa);
      }
    } else {
      throw new Error("Informações da empresa inválidas ou ausentes.");
    }

    const clientePayload: any = {
      status: status as StatusCliente,
      tipoServico: tipoServico as TipoServico[],
      empresa: {
        connect: { id: empresaFinal.id },
      },
    };

    const includeRelations = {
      empresa: {
        include: {
          contatos: true,
          localizacoes: true,
          representantes: true,
          socios: true,
        },
      },
    } as const;

    if (id) {
      const existingCliente = await prisma.cliente.findUnique({
        where: { id },
      });

      if (!existingCliente) {
        throw new Error(`Cliente com ID ${id} não encontrado.`);
      }

      return await prisma.cliente.update({
        where: { id },
        data: clientePayload,
        include: includeRelations,
      });
    } else {
      const existingClienteForEmpresa = await prisma.cliente.findUnique({
        where: { empresaId: empresaFinal.id },
      });

      if (existingClienteForEmpresa) {
        throw new Error(
          `Já existe um cliente associado à empresa com ID: ${empresaFinal.id}`
        );
      }
      return await prisma.cliente.create({
        data: clientePayload,
        include: includeRelations,
      });
    }
  }

  async update(clienteData: any, clienteId: string): Promise<Cliente> {
    return this.save({ ...clienteData, id: clienteId });
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

  async getAll(): Promise<Cliente[]> {
    return await prisma.cliente.findMany({
      include: {
        empresa: true,
      },
    });
  }
}
