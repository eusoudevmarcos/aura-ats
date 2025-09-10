// src/services/usuarioSistema.service.ts
import { TipoUsuario, UsuarioSistema } from "@prisma/client";
import bcrypt from "bcryptjs";
import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { EmpresaRepository } from "../repository/empresa.repository";
import { PessoaRepository } from "../repository/pessoa.repository";
import { buildNestedOperation } from "../utils/buildNestedOperation";

@injectable()
export class UsuarioSistemaService extends buildNestedOperation {
  constructor(
    @inject(PessoaRepository) private pessoaRepository: PessoaRepository,
    @inject(EmpresaRepository) private empresaRepository: EmpresaRepository
  ) {
    super();
  }

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
        empresa: {
          include: {
            contatos: true,
            localizacoes: true,
          },
        },
        funcionario: true,
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
    if (!data.id) {
      await this.checkDuplicates(normalizedData);
    }

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

  private normalizeData(data: any) {
    return {
      ...data,
      pessoa: {
        ...data.pessoa,
        // dataNascimento: this.normalizeDataNascimento(
        //   data.pessoa.dataNascimento
        // ),
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

    if (data.password) {
      usuarioData.password = await bcrypt.hash(data.password, 10);
    }

    if (data.pessoa) {
      usuarioData.pessoa = this.buildNestedOperation(data.pessoa);

      if (data.pessoa.contatos) {
        usuarioData.pessoa.contatos = this.buildNestedOperation(
          data.pessoa.contatos
        );
      }
      if (data.pessoa.localizacoes) {
        usuarioData.pessoa.localizacoes = this.buildNestedOperation(
          data.pessoa.localizacoes
        );
      }
    }

    if (data.empresa) {
      usuarioData.empresa = this.buildNestedOperation(data.empresa);

      if (data.empresa.contatos) {
        usuarioData.empresa.contatos = this.buildNestedOperation(
          data.empresa.contatos
        );
      }
      if (data.empresa.localizacoes) {
        usuarioData.empresa.localizacoes = this.buildNestedOperation(
          data.empresa.localizacoes
        );
      }
    }

    // Funcionário (sempre opcional)
    if (data.funcionario) {
      usuarioData.funcionario = this.buildNestedOperation({
        id: data.funcionario?.id,
        setor: data.funcionario.setor,
        cargo: data.funcionario.cargo,
      });
    }

    return usuarioData;
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

  // private normalizeDataNascimento(dataNascimento: any): Date | null {
  //   if (typeof dataNascimento !== "string") return null;

  //   const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  //   if (!regex.test(dataNascimento)) return null;

  //   const [dia, mes, ano] = dataNascimento.split("/").map(Number);

  //   // Validação básica
  //   if (
  //     dia < 1 ||
  //     dia > 31 ||
  //     mes < 1 ||
  //     mes > 12 ||
  //     ano < 1900 ||
  //     ano > 2100
  //   ) {
  //     return null;
  //   }

  //   // Cria o objeto Date (mês começa do zero)
  //   const data = new Date(ano, mes - 1, dia);

  //   // Confirma se a data realmente existe
  //   if (
  //     data.getFullYear() !== ano ||
  //     data.getMonth() !== mes - 1 ||
  //     data.getDate() !== dia
  //   ) {
  //     return null;
  //   }

  //   return data;
  // }
}
