// src/services/usuarioSistema.service.ts
import { TipoUsuario, UsuarioSistema } from "@prisma/client";
import bcrypt from "bcryptjs";
import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { EmpresaRepository } from "../repository/empresa.repository";
import { PessoaRepository } from "../repository/pessoa.repository";

@injectable()
export class UsuarioSistemaService {
  constructor(
    @inject(PessoaRepository) private pessoaRepository: PessoaRepository,
    @inject(EmpresaRepository) private empresaRepository: EmpresaRepository
  ) {}

  async getById(id: string) {
    console.log(id);
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
          pessoa: true,
          // {
          //   include: {
          //     contatos: true,
          //     localizacoes: true,
          //   },
          // },
          empresa: true,
          // {
          //   include: {
          //     contatos: true,
          //     localizacoes: true,
          //   },
          // },
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
    this.validateBasicFields(data);

    const normalizedData = this.normalizeData(data);

    await this.checkDuplicates(normalizedData);

    // Operação única com Prisma nested
    // return await prisma.$transaction(
    //   async (tx: any) => {
    const usuarioData = await this.buildUsuarioData(normalizedData);

    if (!data.id) {
      return await prisma.usuarioSistema.create({
        data: usuarioData,
        include: this.getIncludeRelations(),
      });
    } else {
      return await prisma.usuarioSistema.update({
        where: { id: data.id },
        data: usuarioData,
        include: this.getIncludeRelations(),
      });
    }
    //   },
    //   {
    //     maxWait: 5000,
    //     timeout: 10000,
    //     isolationLevel: "ReadCommitted",
    //   }
    // );
  }

  private validateBasicFields(data: any): void {
    if (!data.email) throw new Error("E-mail é obrigatório.");
    if (!data.tipoUsuario) throw new Error("Tipo de usuário é obrigatório.");
    if (!data.password && !data.id)
      throw new Error("Senha é obrigatória para criação de usuário.");
    if (!data.pessoa && !data.empresa) {
      throw new Error("Dados de Pessoa ou Empresa são obrigatórios.");
    }
    if (data.pessoa && data.empresa) {
      throw new Error(
        "Usuário não pode ter dados de Pessoa e Empresa simultaneamente."
      );
    }
  }

  private normalizeDataNascimento(dataNascimento: any): Date | null {
    if (typeof dataNascimento !== "string") return null;

    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dataNascimento)) return null;

    const [dia, mes, ano] = dataNascimento.split("/").map(Number);

    // Validação básica
    if (
      dia < 1 ||
      dia > 31 ||
      mes < 1 ||
      mes > 12 ||
      ano < 1900 ||
      ano > 2100
    ) {
      return null;
    }

    // Cria o objeto Date (mês começa do zero)
    const data = new Date(ano, mes - 1, dia);

    // Confirma se a data realmente existe
    if (
      data.getFullYear() !== ano ||
      data.getMonth() !== mes - 1 ||
      data.getDate() !== dia
    ) {
      return null;
    }

    return data;
  }

  private normalizeData(data: any) {
    return {
      ...data,
      pessoa: {
        ...data.pessoa,
        dataNascimento: this.normalizeDataNascimento(
          data.pessoa.dataNascimento
        ),
        cpf: data.pessoa.cpf?.replace(/\D/g, ""),
      },
      empresa: data.empresa
        ? {
            ...data.empresa,
            cnpj: data.empresa.cnpj?.replace(/\D/g, ""),
          }
        : undefined,
    };
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

  private async buildUsuarioData(data: any): Promise<any> {
    const usuarioData: any = {
      email: data.email,
      tipoUsuario: data.tipoUsuario as TipoUsuario,
    };

    // Hash da senha apenas se fornecida
    if (data.password) {
      usuarioData.password = await bcrypt.hash(data.password, 10);
    }

    // Usa operações nested do Prisma para relacionamentos
    if (data.pessoa) {
      usuarioData.pessoa = this.buildNestedOperation(data.pessoa);
    }

    if (data.empresa) {
      usuarioData.empresa = this.buildNestedOperation(data.empresa);
    }

    // Funcionário (sempre opcional)
    if (data.setor || data.cargo) {
      usuarioData.funcionario = this.buildNestedOperation({
        id: data.funcionario?.id,
        setor: data.setor,
        cargo: data.cargo,
      });
    }

    return usuarioData;
  }

  private buildNestedOperation(entityData: any) {
    if (!entityData) return undefined;

    // Se tem ID, é update ou connect
    if (entityData.id) {
      // Se tem outros campos além do ID, é update
      const hasOtherFields = Object.keys(entityData).some(
        (key) => key !== "id" && entityData[key] !== undefined
      );

      if (hasOtherFields) {
        const { id, ...updateData } = entityData;
        return {
          upsert: {
            where: { id },
            create: entityData,
            update: updateData,
          },
        };
      } else {
        // Apenas connect se só tem ID
        return { connect: { id: entityData.id } };
      }
    } else {
      // Sem ID = create
      return { create: entityData };
    }
  }

  private getIncludeRelations() {
    return {
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
  }
}
