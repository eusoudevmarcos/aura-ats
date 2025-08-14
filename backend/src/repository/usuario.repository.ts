import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { UsuarioSistema, Pessoa, Empresa, Funcionario } from "@prisma/client";

type PessoaConnectOrCreate =
  | { connect: { id: string } }
  | {
      create: Omit<
        Pessoa,
        "id" | "createdAt" | "updatedAt" | "empresaRepresentadaId"
      >;
    };

type EmpresaConnectOrCreate =
  | { connect: { id: string } }
  | { create: Omit<Empresa, "id" | "createdAt" | "updatedado"> };

type FuncionarioCreate = Omit<Funcionario, "id" | "usuarioSistemaId">;

export type UsuarioSistemaCreateInput = UsuarioSistema & {
  pessoa?: PessoaConnectOrCreate;
  empresa?: EmpresaConnectOrCreate;
  funcionario?: {
    create: FuncionarioCreate;
  };
};

@injectable()
export class UsuarioSistemaRepository {
  async save(data: UsuarioSistemaCreateInput): Promise<UsuarioSistema> {
    const { pessoa, empresa, funcionario, ...usuarioSistemaData } = data;

    if (usuarioSistemaData.id) {
      return await prisma.usuarioSistema.update({
        where: { id: usuarioSistemaData.id },
        data: {
          ...usuarioSistemaData,
          pessoa: pessoa ? (pessoa as any) : undefined,
          empresa: empresa ? (empresa as any) : undefined,
          funcionario: funcionario ? { create: funcionario.create } : undefined,
        },
      });
    }

    return await prisma.usuarioSistema.create({
      data: {
        ...usuarioSistemaData,
        pessoa: pessoa ? (pessoa as any) : undefined,
        empresa: empresa ? (empresa as any) : undefined,
        funcionario: funcionario ? { create: funcionario.create } : undefined,
      },
    });
  }

  async getUniqueEmail(email: string): Promise<UsuarioSistema | null> {
    return await prisma.usuarioSistema.findFirst({ where: { email } });
  }

  async findById(id: string): Promise<UsuarioSistema | null> {
    return await prisma.usuarioSistema.findUnique({
      where: { id },
      include: {
        pessoa: true,
        empresa: true,
        funcionario: true,
      },
    });
  }
}
