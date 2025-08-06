import { PrismaClient, Profissional, TipoUsuario } from "@prisma/client";
import { randomUUID } from "crypto";
import { injectable } from "tsyringe";

const prisma = new PrismaClient();

export type MedicoInput = {
  crm: string;
  rqe?: string;
  area: "MEDICO" | "ENFERMAGEM" | "TECNOLOGIA" | "OUTRO";
  usuario: {
    nome: string;
    cpf: string;
    email: string;
    password: string;
    tipo: TipoUsuario;
  };

  funcionario?: {
    setor?: string;
    cargo?: string;
  };

  especialidadeIds?: number[];
  hospitalIds?: string[];

  contatos?: {
    telefone?: string;
    email?: string;
    whatsapp?: string;
  };

  localizacao?: {
    cidade: string;
    estado: string;
  };

  formacao?: {
    data_conclusao_medicina?: Date;
    data_conclusao_residencia?: Date;
  };
};

@injectable()
export class ProfissionalModel {
  async create(data: MedicoInput): Promise<Profissional> {
    return await prisma.profissional.create({
      data: {
        area: data.area,
        crm: data.crm,

        pessoa: {
          create: {
            nome: data.usuario.nome,
            cpf: data.usuario.cpf,
            tipo: "FISICA",

            usuario: {
              create: {
                email: data.usuario.email,
                password: randomUUID(), // já hash?
                tipo: data.usuario.tipo,
              },
            },

            funcionario: {
              create: {
                setor: data.funcionario?.setor,
                cargo: data.funcionario?.cargo,
              },
            },
          },
        },

        contato: data.contatos
          ? {
              create: data.contatos,
            }
          : undefined,

        localizacao: data.localizacao
          ? {
              create: data.localizacao,
            }
          : undefined,

        formacao: data.formacao
          ? {
              create: data.formacao,
            }
          : undefined,

        especialidades: data.especialidadeIds?.length
          ? {
              connect: data.especialidadeIds.map((id) => ({ id })),
            }
          : undefined,

        hospitais: data.hospitalIds?.length
          ? {
              create: data.hospitalIds.map((nome) => ({ nome })),
            }
          : undefined,
      },
      include: {
        pessoa: {
          include: {
            usuario: true,
            funcionario: true,
          },
        },
        contato: true,
        localizacao: true,
        formacao: true,
        especialidades: true,
        hospitais: true,
      },
    });
  }

  async getOne(id: string) {
    return await prisma.profissional.findFirst({
      where: { id },
      include: {
        pessoa: {
          include: {
            usuario: true,
            funcionario: true,
          },
        },
        contato: true,
        localizacao: true,
        formacao: true,
        especialidades: true,
        hospitais: true,
      },
    });
  }
}
