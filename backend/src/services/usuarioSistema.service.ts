import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

@injectable()
export class UsuarioSistemaService {
  async saveFuncionarioPessoa(data: any) {
    return await prisma.$transaction(async (tx) => {
      const cpf = data.pessoa.cpf.replace(/\D/g, "");
      const rg = data.pessoa.rg.replace(/\D/g, "");
      if (cpf.replace(/\D/g, "")) {
        const pessoaExistente = await tx.pessoa.findUnique({
          where: { cpf: cpf.replace(/\D/g, "") },
        });
        if (pessoaExistente && pessoaExistente.id !== data.id) {
          throw new Error("CPF já cadastrado");
        }
      }

      const usuarioExistente = await tx.usuarioSistema.findUnique({
        where: { email: data.email },
      });
      if (usuarioExistente && usuarioExistente.id !== data.id) {
        throw new Error("E-mail já cadastrado");
      }

      if (!data.password || data.password.trim() === "") {
        throw new Error("Senha é obrigatória");
      }

      if (!data.id) {
        const usuarioSistema = await tx.usuarioSistema.create({
          data: {
            email: data.email,
            password: await bcrypt.hash(data.password, 10),
            tipoUsuario: data.tipoUsuario,
            pessoa: {
              create: {
                nome: data.pessoa.nome,
                cpf: cpf,
                dataNascimento: data.pessoa.dataNascimento,
                rg: rg,
                estadoCivil: data.pessoa.estadoCivil,
              },
            },
            funcionario: {
              create: {
                setor: data.setor,
                cargo: data.cargo,
              },
            },
          },
          include: { pessoa: true, funcionario: true },
        });
        return usuarioSistema;
      } else {
        const usuarioAtual = await tx.usuarioSistema.findUnique({
          where: { id: data.id },
          include: { pessoa: true, funcionario: true },
        });
        if (!usuarioAtual) throw new Error("Usuário não encontrado");

        return await tx.usuarioSistema.update({
          where: { id: data.id },
          data: {
            email: data.email,
            // Atualiza senha somente se fornecida
            ...(data.password
              ? { password: await bcrypt.hash(data.senha, 10) }
              : {}),
            tipoUsuario: data.tipoUsuario,
            pessoa: {
              update: {
                nome: data.nome,
                cpf: cpf,
                dataNascimento: data.dataNascimento,
                rg: rg,
                estadoCivil: data.estadoCivil,
              },
            },
            funcionario: {
              update: {
                setor: data.setor,
                cargo: data.cargo,
              },
            },
          },
          include: { pessoa: true, funcionario: true },
        });
      }
    });
  }

  async saveFuncionarioEmpresa(data: any) {
    return await prisma.$transaction(async (tx) => {
      const cnpj = data.empresa.cnpj.replace(/\D/g, "");

      const empresaExistente = await tx.empresa.findUnique({
        where: { cnpj: cnpj },
      });
      if (empresaExistente && empresaExistente.id !== data.id) {
        throw new Error("CNPJ já cadastrado");
      }

      const usuarioExistente = await tx.usuarioSistema.findUnique({
        where: { email: data.email },
      });
      if (usuarioExistente && usuarioExistente.id !== data.id) {
        throw new Error("E-mail já cadastrado");
      }

      if (!data.id) {
        // Create nested
        const usuarioSistema = await tx.usuarioSistema.create({
          data: {
            email: data.email,
            password: await bcrypt.hash(data.senha ?? "", 10),
            tipoUsuario: data.tipoUsuario,
            empresa: {
              create: {
                razaoSocial: data.empresa.razaoSocial,
                cnpj: cnpj,
              },
            },
            funcionario: {
              create: {
                setor: data.setor,
                cargo: data.cargo,
              },
            },
          },
          include: { empresa: true, funcionario: true },
        });
        return usuarioSistema;
      } else {
        // Update nested
        const usuarioAtual = await tx.usuarioSistema.findUnique({
          where: { id: data.id },
          include: { empresa: true, funcionario: true },
        });
        if (!usuarioAtual) throw new Error("Usuário não encontrado");

        return await tx.usuarioSistema.update({
          where: { id: data.id },
          data: {
            email: data.email,
            ...(data.senha
              ? { password: await bcrypt.hash(data.senha, 10) }
              : {}),
            tipoUsuario: data.tipoUsuario,
            empresa: {
              update: {
                razaoSocial: data.razaoSocial,
                cnpj: data.cnpj,
              },
            },
            funcionario: {
              update: {
                setor: data.setor,
                cargo: data.cargo,
              },
            },
          },
          include: { empresa: true, funcionario: true },
        });
      }
    });
  }

  async getById(id: string) {
    return await prisma.usuarioSistema.findFirst({
      where: { id },
      include: {
        pessoa: {
          include: {
            contatos: true,
            localizacoes: true,
            formacoes: true,
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
              formacoes: true,
            },
          },
          empresa: {
            include: {
              contatos: true,
              localizacoes: true,
            },
          },
        },
        // orderBy: {
        //   criadoEm: "desc",
        // },
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
}
