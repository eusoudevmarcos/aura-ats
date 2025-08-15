// src/utils/prisma.types.ts
import {
  Prisma,
  Pessoa,
  Empresa,
  Contato,
  Localizacao,
  UsuarioSistema,
  Funcionario,
  Cliente,
  Vaga,
  Habilidade,
  Beneficio,
  Anexo,
  Candidato,
  Formacao,
  ProcessoSeletivoEtapa,
  EventoAgenda,
  Especialidade,
  Socio,
  CandidaturaVaga,
  TipoSocio,
  StatusCliente,
  TipoServico,
  PrismaClient,
} from "@prisma/client";

// Transação do Prisma
export type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

// Tipos base de Input (Omitindo campos auto-gerados e de relação complexa)
export type ContatoInput = Omit<Contato, "id" | "pessoaId" | "empresaId">;
export type LocalizacaoInput = Omit<
  Localizacao,
  "id" | "pessoaId" | "empresaId"
>;
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
  EventoAgenda,
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
  "pessoa" | "especialidade" | "formacoes" | "habilidades"
> & {
  id?: string;
  pessoa: PessoaCreateOrConnectNested;
  especialidade?: EspecialidadeCreateOrConnectNested;
  formacoes?: {
    create?: FormacaoInput[];
    update?: { where: Prisma.FormacaoWhereUniqueInput; data: FormacaoInput }[];
    delete?: Prisma.FormacaoWhereUniqueInput[];
  };
  habilidades?: {
    create?: CandidatoHabilidadeCreateInput[];
    update?: {
      where: Prisma.CandidatoHabilidadeWhereUniqueInput;
      data: Omit<CandidatoHabilidadeCreateInput, "habilidade">;
    }[];
    delete?: Prisma.CandidatoHabilidadeWhereUniqueInput[];
  };
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
  beneficios?: {
    create?: VagaBeneficioCreateInput[];
    delete?: Prisma.VagaBeneficioWhereUniqueInput[];
  };
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
