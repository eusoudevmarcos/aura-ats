import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

@injectable()
export class UsuarioSistemaService {
  async saveFuncionarioPessoa(data: any) {
    return await prisma.$transaction(async (tx) => {
      if (data.pessoa.cpf) {
        const pessoaExistente = await tx.pessoa.findUnique({
          where: { cpf: data.pessoa.cpf },
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
                cpf: data.pessoa.cpf,
                dataNascimento: data.pessoa.dataNascimento,
                rg: data.pessoa.rg,
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
                cpf: data.cpf,
                dataNascimento: data.dataNascimento,
                rg: data.rg,
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
      // Validações simples
      const empresaExistente = await tx.empresa.findUnique({
        where: { cnpj: data.empresa.cnpj },
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
                cnpj: data.empresa.cnpj,
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
    return await prisma.usuarioSistema.findFirst({ where: { id } });
  }
}
