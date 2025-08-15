import { Prisma } from "@prisma/client";
import {
  AnexoInput,
  BeneficioInput,
  ClienteCreateUpdateInput,
  ContatoInput,
  EspecialidadeInput,
  HabilidadeInput,
  LocalizacaoInput,
} from "./prisma.types";

// Tipos para Conectar ou Criar entidades aninhadas (Relações 1-para-1 ou N-para-1)
export type PessoaCreateOrConnectNested =
  | { create: Prisma.PessoaCreateInput }
  | { connect: Prisma.PessoaWhereUniqueInput };
export type EmpresaCreateOrConnectNested =
  | { create: Prisma.EmpresaCreateInput }
  | { connect: Prisma.EmpresaWhereUniqueInput };
export type LocalizacaoCreateOrConnectNested =
  | { create: LocalizacaoInput }
  | { connect: Prisma.LocalizacaoWhereUniqueInput };
export type HabilidadeCreateOrConnectNested =
  | { create: HabilidadeInput }
  | { connect: Prisma.HabilidadeWhereUniqueInput };
export type BeneficioCreateOrConnectNested =
  | { create: BeneficioInput }
  | { connect: Prisma.BeneficioWhereUniqueInput };
export type AnexoCreateOrConnectNested =
  | { create: AnexoInput }
  | { connect: Prisma.AnexoWhereUniqueInput };
export type EspecialidadeCreateOrConnectNested =
  | { create: EspecialidadeInput }
  | { connect: Prisma.EspecialidadeWhereUniqueInput };
export type ClienteCreateOrConnectNested =
  | { create: ClienteCreateUpdateInput }
  | { connect: Prisma.ClienteWhereUniqueInput };

// --- Pessoa ---
export type PessoaCreateUpdateInput = Omit<
  Prisma.PessoaCreateInput,
  "contatos" | "localizacoes" | "socios"
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
  // Sócio é criado a partir da Empresa, não da Pessoa diretamente no fluxo comum
};
