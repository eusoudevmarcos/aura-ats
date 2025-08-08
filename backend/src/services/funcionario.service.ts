import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { EstadoCivil, TipoUsuario } from "@prisma/client";
import bcrypt from "bcryptjs";

@injectable()
export class FuncionarioService {
  constructor() {}

  async createFuncionarioPessoa(data: {
    pessoa: {
      nome: string;
      cpf?: string;
      dataNascimento?: Date;
      estadoCivil?: EstadoCivil;
      rg?: number;
      contatos?: { telefone?: string; whatsapp?: string; email?: string }[];
      localizacoes?: { cidade: string; estado: string }[];
      formacoes?: {
        dataConclusaoMedicina?: Date;
        dataConclusaoResidencia?: Date;
      }[];
    };
    email: string;
    password: string;
    tipoUsuario: TipoUsuario;
    setor?: string;
    cargo?: string;
  }) {
    // Verifica se já existe funcionário com esse email
    const funcionarioEmailExistente = await prisma.funcionario.findUnique({
      where: { email: data.email },
    });
    if (funcionarioEmailExistente) {
      throw new Error("Já existe funcionário com este email.");
    }

    // Tenta achar pessoa pelo cpf
    let pessoa = null;
    if (data.pessoa.cpf) {
      pessoa = await prisma.pessoa.findUnique({
        where: { cpf: data.pessoa.cpf },
      });
    }

    // Se não existir, cria pessoa (com contatos, localizacoes e formacoes se tiver)
    if (!pessoa) {
      pessoa = await prisma.pessoa.create({
        data: {
          nome: data.pessoa.nome,
          cpf: data.pessoa.cpf,
          dataNascimento: data.pessoa.dataNascimento,
          estadoCivil: data.pessoa.estadoCivil,
          rg: data.pessoa.rg,
          contatos: data.pessoa.contatos
            ? {
                create: data.pessoa.contatos.map((c) => ({
                  telefone: c.telefone,
                  whatsapp: c.whatsapp,
                  email: c.email,
                })),
              }
            : undefined,
          localizacoes: data.pessoa.localizacoes
            ? {
                create: data.pessoa.localizacoes.map((l) => ({
                  cidade: l.cidade,
                  estado: l.estado,
                })),
              }
            : undefined,
          formacoes: data.pessoa.formacoes
            ? {
                create: data.pessoa.formacoes.map((f) => ({
                  dataConclusaoMedicina: f.dataConclusaoMedicina,
                  dataConclusaoResidencia: f.dataConclusaoResidencia,
                })),
              }
            : undefined,
        },
      });
    }

    // Cria funcionário vinculado a pessoa
    const funcionario = await prisma.funcionario.create({
      data: {
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
        tipoUsuario: data.tipoUsuario,
        setor: data.setor,
        cargo: data.cargo,
        pessoa: { connect: { id: pessoa.id } },
      },
      include: { pessoa: true, empresa: true },
    });

    return funcionario;
  }

  // Criar funcionário ligado a uma Empresa
  async createFuncionarioEmpresa(data: {
    empresa: {
      razaoSocial: string;
      cnpj: string;
      dataAbertura?: Date;
      contatos?: { telefone?: string; whatsapp?: string; email?: string }[];
      localizacoes?: { cidade: string; estado: string }[];
    };
    email: string;
    password: string;
    tipoUsuario: TipoUsuario;
    setor?: string;
    cargo?: string;
  }) {
    // Verifica se já existe funcionário com esse email
    const funcionarioEmailExistente = await prisma.funcionario.findUnique({
      where: { email: data.email },
    });
    if (funcionarioEmailExistente) {
      throw new Error("Já existe funcionário com este email.");
    }

    // Tenta achar empresa pelo cnpj
    let empresa = await prisma.empresa.findUnique({
      where: { cnpj: data.empresa.cnpj },
    });

    // Se não existir, cria empresa (com contatos e localizacoes se tiver)
    if (!empresa) {
      empresa = await prisma.empresa.create({
        data: {
          razaoSocial: data.empresa.razaoSocial,
          cnpj: data.empresa.cnpj,
          dataAbertura: data.empresa.dataAbertura,
          contatos: data.empresa.contatos
            ? {
                create: data.empresa.contatos.map((c) => ({
                  telefone: c.telefone,
                  whatsapp: c.whatsapp,
                  email: c.email,
                })),
              }
            : undefined,
          localizacoes: data.empresa.localizacoes
            ? {
                create: data.empresa.localizacoes.map((l) => ({
                  cidade: l.cidade,
                  estado: l.estado,
                })),
              }
            : undefined,
        },
      });
    }

    // Cria funcionário vinculado a empresa
    const funcionario = await prisma.funcionario.create({
      data: {
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
        tipoUsuario: data.tipoUsuario,
        setor: data.setor,
        cargo: data.cargo,
        empresa: { connect: { id: empresa.id } },
      },
      include: { pessoa: true, empresa: true },
    });

    return funcionario;
  }
}
