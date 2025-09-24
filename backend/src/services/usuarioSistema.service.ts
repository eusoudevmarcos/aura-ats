// src/services/usuarioSistema.service.ts
import { UsuarioSistema } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { BuildNestedOperation } from "../helper/buildNested/buildNestedOperation";
import { buildUsuarioData } from "../helper/buildNested/usuarioSistema.build";
import { normalizeData } from "../helper/normalize/usuarioSistema.normalize";
import { validateBasicFields } from "../helper/validate/usuarioSistema.validate";
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
    validateBasicFields(data);

    const normalizedData = normalizeData(data);

    if (!data.id) {
      await this.checkDuplicates(normalizedData);
    }

    const usuarioData = await buildUsuarioData(normalizedData);

    const relationsShip = {
      funcionario: { include: { pessoa: true } },
      cliente: { include: { empresa: true } },
    };

    if (!data.id) {
      return await prisma.usuarioSistema.create({
        data: usuarioData,
        include: relationsShip,
      });
    } else {
      return await prisma.usuarioSistema.update({
        where: { id: data.id },
        data: usuarioData,
        include: relationsShip,
      });
    }
  }

  private async checkDuplicates(data: any): Promise<void> {
    // Verifica email duplicado
    const usuarioExistente = await prisma.usuarioSistema.findUnique({
      where: { email: data.email },
    });
    if (usuarioExistente && usuarioExistente.id !== data.id) {
      throw new Error("E-mail já cadastrado.");
    }

    // Verifica CPF duplicado se for pessoa
    if (data.pessoa?.cpf) {
      if (!data.pessoa.cpf) {
        throw new Error("CPF é obrigatório para usuário tipo Pessoa.");
      }

      const pessoaExistente = await this.pessoaRepository.findByCpf(
        data.pessoa.cpf
      );
      if (pessoaExistente && pessoaExistente.id !== data.pessoa.id) {
        throw new Error(
          `CPF '${data.pessoa.cpf}' já cadastrado para outra pessoa.`
        );
      }
    }

    // Verifica CNPJ duplicado se for empresa
    if (data.empresa?.cnpj) {
      if (!data.empresa.cnpj) {
        throw new Error("CNPJ é obrigatório para usuário tipo Empresa.");
      }

      const empresaExistente = await this.empresaRepository.findByCnpj(
        data.empresa.cnpj
      );
      if (empresaExistente && empresaExistente.id !== data.empresa.id) {
        throw new Error(
          `CNPJ '${data.empresa.cnpj}' já cadastrado para outra empresa.`
        );
      }
    }
  }
}
