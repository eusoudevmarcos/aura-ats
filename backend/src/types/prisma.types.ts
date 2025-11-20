// src/utils/prisma.types.ts
import {
  Agenda,
  Anexo,
  Beneficio,
  Contato,
  Empresa,
  Especialidade,
  Formacao,
  Funcionario,
  Habilidade,
  Localizacao,
  Pessoa,
  Prisma,
  PrismaClient,
  ProcessoSeletivoEtapa,
  Socio,
  StatusCliente,
  TipoServico,
  TipoSocio,
  UsuarioSistema,
} from "@prisma/client";

// Transação do Prisma
export type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

// Tipos base de Input (Omitindo campos auto-gerados e de relação complexa)
export type ContatoInput = Omit<Contato, "id" | "pessoaId" | "empresaId">;
export type LocalizacaoInput = Omit<Localizacao, "pessoaId" | "empresaId">;
export type FormacaoInput = Omit<Formacao, "id" | "candidatoId">;
export type HabilidadeInput = Omit<Habilidade, "id">;
export type BeneficioInput = Omit<Beneficio, "id">;
export type AnexoInput = Omit<Anexo, "id">;
export type EspecialidadeInput = Omit<Especialidade, "id">;
export type ProcessoSeletivoEtapaInput = Omit<
  ProcessoSeletivoEtapa,
  "id" | "vagaId"
>;
export type EventoAgendaInput = Omit<
  Agenda,
  "id" | "vagaId" | "localizacaoId" | "etapaAtualId"
>;

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

// =========================================================================================
// TIPOS DE INPUT PARA CREATE/UPDATE (Tipos Principais)
// =========================================================================================

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

// --- Cliente ---
export type ClienteCreateUpdateInput = Omit<
  Prisma.ClienteCreateInput,
  "empresa"
> & {
  id?: string;
  empresa: EmpresaCreateOrConnectNested;
};

// --- Candidato ---
export type CandidatoHabilidadeCreateInput = {
  habilidade: HabilidadeCreateOrConnectNested;
  nivel?: string;
  experienciaAnos?: number;
};

export type CandidatoCreateUpdateInput = Omit<
  Prisma.CandidatoCreateInput,
  "pessoa" | "especialidade" | "formacoes" | "habilidades" | "medico"
> & {
  id?: string;
  pessoa: PessoaCreateOrConnectNested;
  especialidade?: EspecialidadeCreateOrConnectNested;
  formacoes?: {
    create?: FormacaoInput[];
    update?: { where: Prisma.FormacaoWhereUniqueInput; data: FormacaoInput }[];
    delete?: Prisma.FormacaoWhereUniqueInput[];
  };
  medico: any;
  // habilidades?: {
  //   create?: CandidatoHabilidadeCreateInput[];
  //   update?: {
  //     where: Prisma.CandidatoHabilidadeWhereUniqueInput;
  //     data: Omit<CandidatoHabilidadeCreateInput, "habilidade">;
  //   }[];
  //   delete?: Prisma.CandidatoHabilidadeWhereUniqueInput[];
  // };
};

// --- Vaga ---
export type VagaHabilidadeCreateInput = {
  habilidade: HabilidadeCreateOrConnectNested;
  nivelExigido?: string;
};

export type VagaBeneficioCreateInput = {
  beneficio: BeneficioCreateOrConnectNested;
};

export type VagaAnexoCreateInput = {
  anexo: AnexoCreateOrConnectNested;
};

export type VagaCreateUpdateInput = Omit<
  Prisma.VagaCreateInput,
  | "cliente"
  | "localizacao"
  | "habilidades"
  | "beneficios"
  | "anexos"
  | "ProcessoSeletivoEtapa"
  | "eventosAgenda"
  | "candidatos"
  | "CandidaturaVaga"
> & {
  id?: string;
  cliente: { connect: Prisma.ClienteWhereUniqueInput }; // Cliente deve ser conectado, não criado junto com a vaga
  localizacao?: LocalizacaoCreateOrConnectNested;
  habilidades?: {
    create?: VagaHabilidadeCreateInput[];
    update?: {
      where: Prisma.VagaHabilidadeWhereUniqueInput;
      data: Omit<VagaHabilidadeCreateInput, "habilidade">;
    }[];
    delete?: Prisma.VagaHabilidadeWhereUniqueInput[];
  };
  // beneficios?: {
  //   create?: VagaBeneficioCreateInput[];
  //   delete?: Prisma.VagaBeneficioWhereUniqueInput[];
  // };
  anexos?: {
    create?: VagaAnexoCreateInput[];
    delete?: Prisma.VagaAnexoWhereUniqueInput[];
  };
  ProcessoSeletivoEtapa?: {
    create?: ProcessoSeletivoEtapaInput[];
    update?: {
      where: Prisma.ProcessoSeletivoEtapaWhereUniqueInput;
      data: ProcessoSeletivoEtapaInput;
    }[];
    delete?: Prisma.ProcessoSeletivoEtapaWhereUniqueInput[];
  };
  eventosAgenda?: EventoAgendaInput[];
  // Outras relações como eventos e candidaturas são gerenciadas em seus próprios serviços.
};

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
  contatos?: {
    create?: ContatoCreateOrConnect[];
    delete?: Prisma.ContatoWhereUniqueInput[];
  };
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
