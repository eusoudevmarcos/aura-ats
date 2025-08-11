import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { EstadoCivil, TipoUsuario, Funcionario } from "@prisma/client";
import bcrypt from "bcryptjs";

@injectable()
export class FuncionarioService {
  constructor() {}
  async saveFuncionarioPessoa(data: {
    pessoa: {
      nome: string;
      cpf?: string;
      dataNascimento?: Date | string;
      estadoCivil?: EstadoCivil;
      rg?: string;
      contatos?: { telefone?: string; whatsapp?: string; email?: string }[];
      localizacoes?: { cidade: string; estado: string }[];
      formacoes?: {
        dataConclusaoMedicina?: Date | string;
        dataConclusaoResidencia?: Date | string;
      }[];
    };
    email: string;
    password: string;
    tipoUsuario: TipoUsuario;
    setor?: string;
    cargo?: string;
  }) {
    // Busca funcionário pelo email
    let funcionario = await prisma.funcionario.findUnique({
      where: { email: data.email },
      include: { pessoa: true },
    });

    // Corrige o formato do campo dataNascimento para Date, se vier como string
    let dataNascimento: Date | undefined = undefined;
    if (data.pessoa.dataNascimento) {
      if (typeof data.pessoa.dataNascimento === "string") {
        const dt = new Date(data.pessoa.dataNascimento);
        dataNascimento = isNaN(dt.getTime()) ? undefined : dt;
      } else if (data.pessoa.dataNascimento instanceof Date) {
        dataNascimento = data.pessoa.dataNascimento;
      }
    }

    // Função auxiliar para converter datas de formacao
    const mapFormacoes = (
      formacoes?: {
        dataConclusaoMedicina?: Date | string;
        dataConclusaoResidencia?: Date | string;
      }[]
    ) => {
      if (!formacoes) return undefined;
      return formacoes.map((f) => {
        let dataConclusaoMedicina: Date | undefined = undefined;
        let dataConclusaoResidencia: Date | undefined = undefined;

        if (f.dataConclusaoMedicina) {
          if (typeof f.dataConclusaoMedicina === "string") {
            const dt = new Date(f.dataConclusaoMedicina);
            dataConclusaoMedicina = isNaN(dt.getTime()) ? undefined : dt;
          } else if (f.dataConclusaoMedicina instanceof Date) {
            dataConclusaoMedicina = f.dataConclusaoMedicina;
          }
        }
        if (f.dataConclusaoResidencia) {
          if (typeof f.dataConclusaoResidencia === "string") {
            const dt = new Date(f.dataConclusaoResidencia);
            dataConclusaoResidencia = isNaN(dt.getTime()) ? undefined : dt;
          } else if (f.dataConclusaoResidencia instanceof Date) {
            dataConclusaoResidencia = f.dataConclusaoResidencia;
          }
        }

        return {
          dataConclusaoMedicina,
          dataConclusaoResidencia,
        };
      });
    };

    // Se funcionário já existe, atualiza
    if (funcionario) {
      // Atualiza pessoa vinculada
      if (funcionario.pessoa) {
        await prisma.pessoa.update({
          where: { id: funcionario.pessoa.id },
          data: {
            nome: data.pessoa.nome,
            cpf: data.pessoa.cpf,
            dataNascimento: dataNascimento,
            estadoCivil: data.pessoa.estadoCivil,
            rg: data.pessoa.rg,
            // Atualiza contatos: deleta todos e recria (simples, mas pode ser melhorado)
            contatos: {
              deleteMany: {},
              create: data.pessoa.contatos
                ? data.pessoa.contatos.map((c) => ({
                    telefone: c.telefone,
                    whatsapp: c.whatsapp,
                    email: c.email,
                  }))
                : [],
            },
            localizacoes: {
              deleteMany: {},
              create: data.pessoa.localizacoes
                ? data.pessoa.localizacoes.map((l) => ({
                    cidade: l.cidade,
                    estado: l.estado,
                  }))
                : [],
            },
            formacoes: {
              deleteMany: {},
              create: mapFormacoes(data.pessoa.formacoes) || [],
            },
          },
        });
      }

      // Atualiza funcionário
      const funcionarioAtualizado = await prisma.funcionario.update({
        where: { id: funcionario.id },
        data: {
          password: await bcrypt.hash(data.password, 10),
          tipoUsuario: data.tipoUsuario,
          setor: data.setor,
          cargo: data.cargo,
        },
        include: { pessoa: true, empresa: true },
      });

      return funcionarioAtualizado;
    }

    // Se não existir funcionário, tenta achar pessoa pelo cpf
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
          dataNascimento: dataNascimento,
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
                create: mapFormacoes(data.pessoa.formacoes),
              }
            : undefined,
        },
      });
    }

    // Cria funcionário vinculado a pessoa
    const funcionarioCriado = await prisma.funcionario.create({
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

    return funcionarioCriado;
  }

  async saveFuncionarioEmpresa(data: {
    empresa: {
      razaoSocial: string;
      cnpj: string;
      dataAbertura?: Date | string;
      contatos?: { telefone?: string; whatsapp?: string; email?: string }[];
      localizacoes?: { cidade: string; estado: string }[];
    };
    email: string;
    password: string;
    tipoUsuario: TipoUsuario;
    setor?: string;
    cargo?: string;
  }) {
    // Busca funcionário pelo email
    let funcionario = await prisma.funcionario.findUnique({
      where: { email: data.email },
      include: { empresa: true },
    });

    // Corrige o formato do campo dataAbertura para Date, se vier como string
    let dataAbertura: Date | undefined = undefined;
    if (data.empresa.dataAbertura) {
      if (typeof data.empresa.dataAbertura === "string") {
        const dt = new Date(data.empresa.dataAbertura);
        dataAbertura = isNaN(dt.getTime()) ? undefined : dt;
      } else if (data.empresa.dataAbertura instanceof Date) {
        dataAbertura = data.empresa.dataAbertura;
      }
    }

    // Busca empresa pelo CNPJ
    let empresa = await prisma.empresa.findUnique({
      where: { cnpj: data.empresa.cnpj },
      include: { contatos: true, localizacoes: true },
    });

    if (!empresa) {
      // Cria empresa se não existir
      empresa = await prisma.empresa.create({
        data: {
          razaoSocial: data.empresa.razaoSocial,
          cnpj: data.empresa.cnpj,
          dataAbertura: dataAbertura ?? null,
          contatos: data.empresa.contatos
            ? {
                create: data.empresa.contatos.map((c) => ({
                  telefone: c.telefone,
                  whatsapp: c.whatsapp,
                  email: c.email,
                })),
              }
            : { create: [] },
          localizacoes: data.empresa.localizacoes
            ? {
                create: data.empresa.localizacoes.map((l) => ({
                  cidade: l.cidade,
                  estado: l.estado,
                })),
              }
            : { create: [] },
        },
        include: { contatos: true, localizacoes: true },
      });
    } else {
      // Atualiza empresa se já existir
      await prisma.empresa.update({
        where: { id: empresa.id },
        data: {
          razaoSocial: data.empresa.razaoSocial,
          dataAbertura: dataAbertura,
          // Atualiza contatos e localizações: remove todos e recria (simples, mas pode ser melhorado)
          contatos: {
            deleteMany: {},
            create: data.empresa.contatos
              ? data.empresa.contatos.map((c) => ({
                  telefone: c.telefone,
                  whatsapp: c.whatsapp,
                  email: c.email,
                }))
              : [],
          },
          localizacoes: {
            deleteMany: {},
            create: data.empresa.localizacoes
              ? data.empresa.localizacoes.map((l) => ({
                  cidade: l.cidade,
                  estado: l.estado,
                }))
              : [],
          },
        },
      });
    }

    if (funcionario) {
      // Atualiza funcionário existente
      const funcionarioAtualizado = await prisma.funcionario.update({
        where: { id: funcionario.id },
        data: {
          password: data.password
            ? await bcrypt.hash(data.password, 10)
            : funcionario.password,
          tipoUsuario: data.tipoUsuario,
          setor: data.setor,
          cargo: data.cargo,
          empresa: { connect: { id: empresa.id } },
        },
        include: { pessoa: true, empresa: true },
      });
      return funcionarioAtualizado;
    } else {
      // Cria novo funcionário
      const funcionarioCriado = await prisma.funcionario.create({
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
      return funcionarioCriado;
    }
  }

  /**
   * Busca todos os funcionários de forma paginada.
   * @param page número da página (começando em 1)
   * @param pageSize quantidade de itens por página
   */
  async getAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    const [funcionarios, total] = await Promise.all([
      await prisma.funcionario.findMany({
        skip,
        take: pageSize,
        include: { pessoa: true, empresa: true },
        orderBy: { id: "asc" },
      }),
      await prisma.funcionario.count(),
    ]);

    return {
      data: funcionarios,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string): Promise<Funcionario | null> {
    return await prisma.funcionario.findFirst({
      where: { id },
      include: {
        pessoa: {
          include: {
            contatos: true,
          },
        },
        empresa: true,
      },
    });
  }
}
