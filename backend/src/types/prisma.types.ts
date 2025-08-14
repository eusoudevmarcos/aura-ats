// src/utils/prisma.types.ts
import {
  Contato,
  Localizacao,
  Pessoa,
  Empresa,
  Funcionario,
  Formacao,
  TipoSocio,
  StatusCliente,
  TipoServico,
  UsuarioSistema,
  Especialidade,
  Prisma,
  PrismaClient,
} from "@prisma/client";

export type ContatoCreateOrConnect =
  | Omit<Contato, "id" | "pessoaId" | "empresaId">
  | { id: string };

export type LocalizacaoCreateOrConnect =
  | Omit<Localizacao, "id" | "pessoaId" | "empresaId">
  | { id: string };

export type FormacaoCreate = Omit<Formacao, "id" | "pessoaId">;

export type SocioCreateForPessoa = {
  tipoSocio: TipoSocio;
  empresa: {
    connect: { id: string };
  };
};

export type SocioCreateForEmpresa = {
  tipoSocio: TipoSocio;
  pessoa: {
    create?: PessoaCreateInput;
    connect?: Pick<Pessoa, "id">;
  };
};

export type PessoaCreateInput = Omit<
  Pessoa,
  "id" | "createdAt" | "updatedAt" | "empresaRepresentadaId"
> & {
  contatos?: {
    create?: ContatoCreateOrConnect[];
    connect?: Pick<Contato, "id">[];
  };
  localizacoes?: {
    create?: LocalizacaoCreateOrConnect[];
    connect?: Pick<Localizacao, "id">[];
  };
  formacoes?: { create?: FormacaoCreate[] };
  socios?: { create?: SocioCreateForPessoa[] };
};

export type PessoaCreateOrConnectForRepresentante =
  | PessoaCreateInput
  | { id: string };

export type EmpresaCreateInput = Omit<
  Empresa,
  "id" | "createdAt" | "updatedAt"
> & {
  contatos?: {
    create?: ContatoCreateOrConnect[];
    connect?: Pick<Contato, "id">[];
  };
  localizacoes?: {
    create?: LocalizacaoCreateOrConnect[];
    connect?: Pick<Localizacao, "id">[];
  };
  representantes?: {
    create?: PessoaCreateOrConnectForRepresentante[];
    connect?: Pick<Pessoa, "id">[];
  };
  socios?: {
    create?: {
      tipoSocio: TipoSocio;
      pessoa: {
        create?: PessoaCreateInput;
        connect?: Pick<Pessoa, "id">;
      };
    }[];
  };
};

export type EmpresaUpdateInput = Partial<
  Omit<Empresa, "createdAt" | "updatedAt">
> & {
  id: string;
  contatos?: {
    create?: ContatoCreateOrConnect[];
    connect?: Pick<Contato, "id">[];
    update?: { where: Pick<Contato, "id">; data: Partial<Contato> }[];
  };
  localizacoes?: {
    create?: LocalizacaoCreateOrConnect[];
    connect?: Pick<Localizacao, "id">[];
    update?: { where: Pick<Localizacao, "id">; data: Partial<Localizacao> }[];
  };
  representantes?: {
    create?: PessoaCreateOrConnectForRepresentante[];
    connect?: Pick<Pessoa, "id">[];
    set?: Pick<Pessoa, "id">[];
  };
  socios?: {
    create?: {
      tipoSocio: TipoSocio;
      pessoa: {
        create?: PessoaCreateInput;
        connect?: Pick<Pessoa, "id">;
      };
    }[];
  };
};

export type PessoaConnectOrCreate =
  | { connect: { id: string } }
  | {
      create: Omit<
        Pessoa,
        "id" | "createdAt" | "updatedAt" | "empresaRepresentadaId"
      >;
    };

export type EmpresaConnectOrCreate =
  | { connect: { id: string } }
  | { create: Omit<Empresa, "id" | "createdAt" | "updatedAt"> };

export type FuncionarioCreate = Omit<Funcionario, "id" | "usuarioSistemaId">;

export type UsuarioSistemaCreateInput = Omit<UsuarioSistema, "id"> & {
  pessoa?: PessoaConnectOrCreate;
  empresa?: EmpresaConnectOrCreate;
  funcionario?: {
    create: FuncionarioCreate;
  };
};

export type ClientePrismaCreateInput = {
  status: StatusCliente;
  tipoServico: TipoServico[];
  empresa: {
    create?: Omit<EmpresaCreateInput, "id">;
    connect?: Pick<Empresa, "id">;
  };
};

export type ClientePrismaUpdateInput = {
  status?: StatusCliente;
  tipoServico?: TipoServico[];
  empresa?: {
    create?: Omit<EmpresaCreateInput, "id">;
    connect?: Pick<Empresa, "id">;
    update?: Omit<EmpresaCreateInput, "id">;
    disconnect?: boolean;
  };
};

export const splitCreateConnect = <T extends { id?: string }>(
  items?: T[]
): { create?: Omit<T, "id">[]; connect?: { id: string }[] } | undefined => {
  if (!items?.length) return undefined;

  const create = items.filter((item) => !item.id) as Omit<T, "id">[];

  const connect = items
    .filter((item): item is T & { id: string } => typeof item.id === "string")
    .map((item) => ({ id: item.id }));

  const result: { create?: Omit<T, "id">[]; connect?: { id: string }[] } = {};
  if (create.length) result.create = create;
  if (connect.length) result.connect = connect;

  return Object.keys(result).length ? result : undefined;
};

export type PessoaCreateInputNested = Omit<
  Prisma.PessoaCreateInput,
  "contatos" | "localizacoes" | "formacoes"
> & {
  contatos?: {
    create?: ContatoCreateOrConnect[];
    connect?: Prisma.ContatoWhereUniqueInput[];
  };
  localizacoes?: {
    create?: LocalizacaoCreateOrConnect[];
    connect?: Prisma.LocalizacaoWhereUniqueInput[];
  };
  formacoes?: { create?: Prisma.FormacaoCreateInput[] };
};

export type PessoaUpdateInputNested = Partial<
  Omit<Prisma.PessoaUpdateInput, "contatos" | "localizacoes" | "formacoes">
> & {
  id?: string;
  contatos?: {
    create?: ContatoCreateOrConnect[];
    update?: Prisma.ContatoUpdateWithWhereUniqueWithoutPessoaInput[];
    delete?: Prisma.ContatoWhereUniqueInput[];
  };
  localizacoes?: {
    create?: LocalizacaoCreateOrConnect[];
    update?: Prisma.LocalizacaoUpdateWithWhereUniqueWithoutPessoaInput[];
    delete?: Prisma.LocalizacaoWhereUniqueInput[];
  };
  formacoes?: {
    create?: Prisma.FormacaoCreateInput[];
    // update?: Prisma.FormacaoUpdateWithWhereUniqueWithoutPessoaInput[];
    delete?: Prisma.FormacaoWhereUniqueInput[];
  };
};
export type CandidatoCreateInput = Omit<
  Prisma.CandidatoCreateInput,
  "pessoa" | "especialidade" | "vagas"
> & {
  pessoa: {
    create?: PessoaCreateInputNested;
    connect?: Prisma.PessoaWhereUniqueInput;
  };
  especialidade?: {
    connect?: Prisma.EspecialidadeWhereUniqueInput;
  };
  vagas?: {
    connect?: Prisma.VagaWhereUniqueInput[];
  };
};

export type CandidatoUpdateInput = Partial<
  Omit<Prisma.CandidatoUpdateInput, "pessoa" | "especialidade" | "vagas">
> & {
  id: string;
  pessoa?: {
    update?: PessoaUpdateInputNested;
    connect?: Prisma.PessoaWhereUniqueInput;
    disconnect?: boolean;
  };
  especialidade?: {
    connect?: Prisma.EspecialidadeWhereUniqueInput;
    disconnect?: boolean;
  };
  vagas?: {
    connect?: Prisma.VagaWhereUniqueInput[];
    set?: Prisma.VagaWhereUniqueInput[];
  };
};

export type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
