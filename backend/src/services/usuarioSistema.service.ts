// src/services/usuarioSistema.service.ts
import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { PessoaRepository } from "../repository/pessoa.repository"; // Importe o PessoaRepository
import { EmpresaRepository } from "../repository/empresa.repository"; // Importe o EmpresaRepository
import { Empresa, Pessoa, UsuarioSistema, TipoUsuario } from "@prisma/client"; // Adicione tipos necessários
// ...
@injectable()
export class UsuarioSistemaService {
  constructor(
    @inject(PessoaRepository) private pessoaRepository: PessoaRepository,
    @inject(EmpresaRepository) private empresaRepository: EmpresaRepository
  ) {}

  async getById(id: string) {
    return await prisma.usuarioSistema.findFirst({
      where: { id },
      include: {
        pessoa: {
          include: {
            contatos: true,
            localizacoes: true,
          },
        },
        funcionario: true,
        empresa: {
          include: {
            contatos: true,
            localizacoes: true,
          },
        },
      },
    });
  }

  async getAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    try {
      // Consulta os usuários com paginação
      const usuarios = await prisma.usuarioSistema.findMany({
        skip: skip,
        take: pageSize,
        include: {
          funcionario: true,
          pessoa: {
            include: {
              contatos: true,
              localizacoes: true,
            },
          },
          empresa: {
            include: {
              contatos: true,
              localizacoes: true,
            },
          },
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
    } finally {
      await prisma.$disconnect(); // Desconecta o Prisma após a operação
    }
  }

  async save(data: any): Promise<UsuarioSistema> {
    return await prisma.$transaction(async (tx) => {
      if (!data.email) {
        throw new Error("E-mail é obrigatório.");
      }
      if (!data.tipoUsuario) {
        throw new Error("Tipo de usuário é obrigatório.");
      }
      if (!data.password && !data.id) {
        throw new Error("Senha é obrigatória para criação de usuário.");
      }

      const cpfLimpo = data.pessoa?.cpf
        ? data.pessoa.cpf.replace(/\D/g, "")
        : undefined;
      const cnpjLimpo = data.empresa?.cnpj
        ? data.empresa.cnpj.replace(/\D/g, "")
        : undefined;

      const usuarioExistente = await tx.usuarioSistema.findUnique({
        where: { email: data.email },
      });
      if (usuarioExistente && usuarioExistente.id !== data.id) {
        throw new Error("E-mail já cadastrado.");
      }

      let pessoaIdToConnect: string | undefined;
      let empresaIdToConnect: string | undefined;

      if (data.pessoa) {
        if (cnpjLimpo) {
          throw new Error(
            "Usuário não pode ter dados de Pessoa e Empresa simultaneamente."
          );
        }
        if (!cpfLimpo) {
          throw new Error("CPF é obrigatório para usuário tipo Pessoa.");
        }
        const pessoaExistentePorCpf =
          await this.pessoaRepository.saveWithTransaction(cpfLimpo, tx);
        if (
          pessoaExistentePorCpf &&
          pessoaExistentePorCpf.id !== (data.pessoa.id || data.id)
        ) {
          throw new Error("CPF já cadastrado para outra pessoa.");
        }

        const savedPessoa = await this.pessoaRepository.saveWithTransaction(
          data.pessoa,
          tx
        );
        pessoaIdToConnect = savedPessoa.id;
      } else if (data.empresa) {
        if (cpfLimpo) {
          throw new Error(
            "Usuário não pode ter dados de Pessoa e Empresa simultaneamente."
          );
        }
        if (!cnpjLimpo) {
          throw new Error("CNPJ é obrigatório para usuário tipo Empresa.");
        }
        const empresaExistentePorCnpj =
          await this.empresaRepository.findByCnpjWithTransaction(cnpjLimpo, tx);
        if (
          empresaExistentePorCnpj &&
          empresaExistentePorCnpj.id !== (data.empresa.id || data.id)
        ) {
          throw new Error("CNPJ já cadastrado para outra empresa.");
        }

        const savedEmpresa = await this.empresaRepository.saveWithTransaction(
          data.empresa,
          tx
        );
        empresaIdToConnect = savedEmpresa.id;
      } else {
        throw new Error(
          "Dados de Pessoa ou Empresa são obrigatórios para o usuário do sistema."
        );
      }

      const hashedPassword = data.password
        ? await bcrypt.hash(data.password, 10)
        : undefined;

      const usuarioSistemaData: any = {
        email: data.email,
        tipoUsuario: data.tipoUsuario as TipoUsuario,
        ...(hashedPassword ? { password: hashedPassword } : {}),
        funcionario: {
          upsert: {
            where: {
              usuarioSistemaId:
                data.id || "00000000-0000-0000-0000-000000000000",
            },
            create: {
              setor: data.setor,
              cargo: data.cargo,
            },
            update: {
              setor: data.setor,
              cargo: data.cargo,
            },
          },
        },
      };

      if (pessoaIdToConnect) {
        usuarioSistemaData.pessoa = { connect: { id: pessoaIdToConnect } };
      } else if (empresaIdToConnect) {
        usuarioSistemaData.empresa = { connect: { id: empresaIdToConnect } };
      }

      const includeRelations = {
        pessoa: {
          include: {
            contatos: true,
            localizacoes: true,
            formacoes: true,
          },
        },
        empresa: {
          include: {
            contatos: true,
            localizacoes: true,
            representantes: true,
            socios: true,
          },
        },
        funcionario: true,
      };

      if (!data.id) {
        const newUsuario = await tx.usuarioSistema.create({
          data: usuarioSistemaData,
          include: includeRelations,
        });
        return newUsuario;
      } else {
        const existingUsuario = await tx.usuarioSistema.findUnique({
          where: { id: data.id },
        });
        if (!existingUsuario) {
          throw new Error(
            "Usuário do sistema não encontrado para atualização."
          );
        }

        const updatedUsuario = await tx.usuarioSistema.update({
          where: { id: data.id },
          data: usuarioSistemaData,
          include: includeRelations,
        });
        return updatedUsuario;
      }
    });
  }
}
