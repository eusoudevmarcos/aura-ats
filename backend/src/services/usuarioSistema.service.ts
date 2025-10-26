// src/services/usuarioSistema.service.ts
import { UsuarioSistema } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { BuildNestedOperation } from "../helper/buildNested/buildNestedOperation";
import { normalizeClienteData } from "../helper/normalize/cliente.normalize";
import { normalizeDataUsuarioSistema } from "../helper/normalize/usuarioSistema.normalize";
import { validateBasicFieldsUsuarioSistema } from "../helper/validate/usuarioSistema.validate";
import prisma from "../lib/prisma";
import { EmpresaRepository } from "../repository/empresa.repository";
import { PessoaRepository } from "../repository/pessoa.repository";

@injectable()
export class UsuarioSistemaService extends BuildNestedOperation {
  constructor(
    @inject(PessoaRepository) private pessoaRepository: PessoaRepository,
    @inject(EmpresaRepository) private empresaRepository: EmpresaRepository
  ) {
    super();
  }

  async getById(id: string) {
    return await prisma.usuarioSistema.findFirst({
      where: { id },
      include: {
        funcionario: {
          include: {
            pessoa: {
              include: {
                contatos: true,
                localizacoes: true,
              },
            },
          },
        },
        cliente: {
          include: {
            empresa: {
              include: {
                contatos: true,
                localizacoes: true,
              },
            },
          },
        },
      },
    });
  }

  async getAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    try {
      const usuarios = await prisma.usuarioSistema.findMany({
        orderBy: {
          funcionario: {
            pessoa: {
              updatedAt: "desc",
            },
          },
        },
        skip: skip,
        take: pageSize,
        include: {
          funcionario: {
            include: {
              pessoa: {
                select: { nome: true },
              },
            },
          },
          cliente: { include: { empresa: true } },
        },
      });

      const totalUsuarios = await prisma.usuarioSistema.count();

      return {
        data: usuarios,
        total: totalUsuarios,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalUsuarios / pageSize),
      };
    } catch (error) {
      console.error("Erro ao buscar usuários do sistema:", error);
      throw new Error("Não foi possível buscar os usuários do sistema.");
    }
  }

  async save(data: any): Promise<UsuarioSistema> {
    validateBasicFieldsUsuarioSistema(data);

    const normalizedUsuarioData = normalizeDataUsuarioSistema(data);
    if (normalizedUsuarioData.cliente) {
      normalizedUsuarioData.cliente = normalizeClienteData(
        normalizedUsuarioData.cliente
      );
    }

    if (!normalizedUsuarioData.id) {
      await this.checkDuplicates(normalizedUsuarioData);
    }

    if (normalizedUsuarioData.cliente?.id) {
      const clienteExistente = await prisma.usuarioSistema.findFirst({
        where: {
          clienteId: normalizedUsuarioData.cliente.id,
        },
      });

      if (
        clienteExistente &&
        clienteExistente.id !== normalizedUsuarioData.id
      ) {
        throw new Error("CNPJ do cliente já vinculado a uma conta");
      }
    }

    const usuarioData = this.build(normalizedUsuarioData);
    console.log(JSON.stringify(usuarioData));
    const relationsShip = {
      funcionario: { include: { pessoa: true } },
      cliente: { include: { empresa: true } },
    };

    if (!normalizedUsuarioData.id) {
      return await prisma.usuarioSistema.create({
        data: usuarioData,
        include: relationsShip,
      });
    } else {
      return await prisma.usuarioSistema.update({
        where: { id: normalizedUsuarioData.id },
        data: usuarioData,
        include: relationsShip,
      });
    }
  }

  async delete(id: string) {
    try {
      return await prisma.usuarioSistema.delete({ where: { id } });
    } catch (err) {
      return err;
    }
  }

  private async checkDuplicates(data: any): Promise<void> {
    const usuarioExistente = await prisma.usuarioSistema.findUnique({
      where: { email: data.email },
    });
    if (usuarioExistente && usuarioExistente.id !== data.id) {
      throw new Error("E-mail já cadastrado.");
    }

    if (data?.funcionario?.pessoa?.cpf) {
      if (!data.funcionario.pessoa.cpf) {
        throw new Error("CPF é obrigatório para usuário tipo Pessoa.");
      }

      const pessoaExistente = await this.pessoaRepository.findByCpf(
        data.funcionario.pessoa.cpf
      );
      if (
        pessoaExistente &&
        pessoaExistente.id !== data.funcionario.pessoa.id
      ) {
        throw new Error(
          `CPF '${data.funcionario.pessoa.cpf}' já cadastrado para outra pessoa.`
        );
      }
    }

    if (data?.cliente?.empresa?.cnpj) {
      if (!data?.cliente?.empresa.cnpj) {
        throw new Error("CNPJ é obrigatório para usuário tipo Empresa.");
      }

      const empresaExistente = await this.empresaRepository.findByCnpj(
        data?.cliente?.empresa.cnpj
      );
      if (
        empresaExistente &&
        empresaExistente.id !== data?.cliente?.empresa.id
      ) {
        throw new Error(
          `CNPJ '${data.cliente.empresa.cnpj}' já cadastrado para outra empresa.`
        );
      }
    }
  }
}
