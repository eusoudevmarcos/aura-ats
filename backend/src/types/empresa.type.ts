import { Prisma, Socio, TipoSocio } from "@prisma/client";
import {
  ContatoInput,
  LocalizacaoInput,
  PessoaCreateOrConnectNested,
} from "./prisma.types";

// --- Empresa ---
export type EmpresaCreateUpdateInput = Omit<
  Prisma.EmpresaCreateInput,
  "contatos" | "localizacoes" | "socios" | "representantes"
> & {
  id?: string;
  contatos?: {
    create?: ContatoInput[];
    update?: { where: Prisma.ContatoWhereUniqueInput; data: ContatoInput }[];
    delete?: Prisma.ContatoWhereUniqueInput[];
  };
  localizacoes?: {
    create?: LocalizacaoInput[];
    update?: {
      where: Prisma.LocalizacaoWhereUniqueInput;
      data: LocalizacaoInput;
    }[];
    delete?: Prisma.LocalizacaoWhereUniqueInput[];
  };
  socios?: {
    create?: (Omit<Socio, "id" | "empresaId"> & {
      pessoa: PessoaCreateOrConnectNested;
    })[];
    update?: {
      where: Prisma.SocioWhereUniqueInput;
      data: { tipoSocio?: TipoSocio };
    }[];
    delete?: Prisma.SocioWhereUniqueInput[];
  };
  representantes?: {
    connect?: Prisma.PessoaWhereUniqueInput[];
    disconnect?: Prisma.PessoaWhereUniqueInput[];
  };
};
