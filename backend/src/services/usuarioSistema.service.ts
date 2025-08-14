// src/services/usuarioSistema.service.ts
import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { PessoaRepository } from "../repository/pessoa.repository";
import { EmpresaRepository } from "../repository/empresa.repository";
import { Empresa, Pessoa, UsuarioSistema, TipoUsuario } from "@prisma/client";

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
    }
    // Removido `finally { await prisma.$disconnect(); }`
    // Gerenciamento de conexão é feito pelo Tsyringe/singleton de Prisma.
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

        const existingPessoaByCpf =
          await this.pessoaRepository.findByCpfWithTransaction(cpfLimpo, tx);

        if (
          existingPessoaByCpf &&
          existingPessoaByCpf.id !== (data.pessoa.id || undefined)
        ) {
          throw new Error(
            `CPF '${data.pessoa.cpf}' já cadastrado para outra pessoa.`
          );
        }

        const savedPessoa = await this.pessoaRepository.saveWithTransaction(
          { ...data.pessoa, cpf: cpfLimpo },
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

        const existingEmpresaByCnpj =
          await this.empresaRepository.findByCnpjWithTransaction(cnpjLimpo, tx);

        if (
          existingEmpresaByCnpj &&
          existingEmpresaByCnpj.id !== (data.empresa.id || undefined)
        ) {
          throw new Error(
            `CNPJ '${data.empresa.cnpj}' já cadastrado para outra empresa.`
          );
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
        // Criar novo usuário
        // Quando criamos um UsuarioSistema, se houver dados de funcionário, usamos 'create'
        if (data.setor || data.cargo) {
          usuarioSistemaData.funcionario = {
            create: {
              setor: data.setor,
              cargo: data.cargo,
            },
          };
        }

        const newUsuario = await tx.usuarioSistema.create({
          data: usuarioSistemaData,
          include: includeRelations,
        });
        return newUsuario;
      } else {
        // Atualizar usuário existente
        const existingUsuario = await tx.usuarioSistema.findUnique({
          where: { id: data.id },
          include: { funcionario: true }, // Incluir funcionário para verificar se já existe
        });
        if (!existingUsuario) {
          throw new Error(
            "Usuário do sistema não encontrado para atualização."
          );
        }

        // Lógica para atualização do funcionário (se existir ou se for para criar/atualizar)
        if (data.setor || data.cargo) {
          usuarioSistemaData.funcionario = existingUsuario.funcionario
            ? {
                // Se o funcionário já existe, faz update
                update: {
                  setor: data.setor,
                  cargo: data.cargo,
                },
              }
            : {
                // Se o funcionário não existe, mas dados foram fornecidos, cria
                create: {
                  setor: data.setor,
                  cargo: data.cargo,
                },
              };
        } else if (existingUsuario.funcionario) {
          // Se não há dados de setor/cargo no input, mas um funcionário existe,
          // podemos considerar deletá-lo ou deixá-lo como está.
          // Por enquanto, vamos manter se não for especificado para apagar.
          // Para deletar, você precisaria de uma flag ou outro controle.
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
