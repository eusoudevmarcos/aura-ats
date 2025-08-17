import {
  AreaCandidato,
  Candidato,
  Cliente,
  Habilidade,
  Localizacao,
} from "@prisma/client";

// ===================== ENUMS =====================
export enum CategoriaVaga {
  TECNOLOGIA = "TECNOLOGIA",
  SAUDE = "SAUDE",
  ADMINISTRATIVO = "ADMINISTRATIVO",
  FINANCEIRO = "FINANCEIRO",
  RECURSOS_HUMANOS = "RECURSOS_HUMANOS",
  MARKETING = "MARKETING",
  VENDAS = "VENDAS",
  OUTROS = "OUTROS",
}

export enum StatusVaga {
  ATIVA = "ATIVA",
  PAUSADA = "PAUSADA",
  ENCERRADA = "ENCERRADA",
  ARQUIVADA = "ARQUIVADA",
}

export enum TipoContrato {
  CLT = "CLT",
  PJ = "PJ",
  ESTAGIO = "ESTAGIO",
  FREELANCER = "FREELANCER",
  TEMPORARIO = "TEMPORARIO",
}

export enum NivelExperiencia {
  ESTAGIO = "ESTAGIO",
  JUNIOR = "JUNIOR",
  PLENO = "PLENO",
  SENIOR = "SENIOR",
  ESPECIALISTA = "ESPECIALISTA",
  GERENTE = "GERENTE",
}

export enum TipoEtapa {
  APLICACAO = "APLICACAO",
  TRIAGEM = "TRIAGEM",
  TESTE = "TESTE",
  ENTREVISTA = "ENTREVISTA",
  OFERTA = "OFERTA",
  CONTRATACAO = "CONTRATACAO",
}

export enum StatusCandidatura {
  APLICADO = "APLICADO",
  EM_ANALISE = "EM_ANALISE",
  ENTREVISTA_AGENDADA = "ENTREVISTA_AGENDADA",
  ENTREVISTA_CONCLUIDA = "ENTREVISTA_CONCLUIDA",
  OFERTA_ENVIADA = "OFERTA_ENVIADA",
  OFERTA_ACEITA = "OFERTA_ACEITA",
  OFERTA_RECUSADA = "OFERTA_RECUSADA",
  DESCLASSIFICADO = "DESCLASSIFICADO",
  CONTRATADO = "CONTRATADO",
}

export enum TipoEventoAgenda {
  TRIAGEM_INICIAL = "TRIAGEM_INICIAL",
  ENTREVISTA_RH = "ENTREVISTA_RH",
  ENTREVISTA_GESTOR = "ENTREVISTA_GESTOR",
  TESTE_TECNICO = "TESTE_TECNICO",
  TESTE_PSICOLOGICO = "TESTE_PSICOLOGICO",
  DINAMICA_GRUPO = "DINAMICA_GRUPO",
  PROPOSTA = "PROPOSTA",
  OUTRO = "OUTRO",
}

// ===================== INTERFACES =====================

export interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  requisitos?: string;
  responsabilidades?: string;
  salarioMinimo?: number;
  salarioMaximo?: number;
  dataPublicacao: Date;
  dataFechamento?: Date;
  create_at: Date;
  update_at: Date;

  categoria: CategoriaVaga;
  status: StatusVaga;
  tipoContrato: TipoContrato;
  nivelExperiencia: NivelExperiencia;
  areaCandidato?: AreaCandidato; // Definir tipagem real dessa entidade

  candidatos: Candidato[];
  CandidaturaVaga: CandidaturaVaga[];
  agendaVaga: AgendaVaga[];
  beneficios: Beneficio[];
  habilidades: VagaHabilidade[];
  anexos: VagaAnexo[];

  cliente: Cliente;
  clienteId: string;

  localizacao?: Localizacao;
  localizacaoId?: string;
}

export interface VagaHabilidade {
  nivelExigido?: string;
  vagaId: string;
  habilidadeId: string;

  vaga: Vaga;
  habilidade: Habilidade;
}

export interface ProcessoSeletivoEtapa {
  id: string;
  nome: string;
  tipo: TipoEtapa;
  ordem: number;
  descricao?: string;
  ativa: boolean;

  agendaVaga: AgendaVaga[];
  candidaturas: CandidaturaVaga[];
}

export interface AgendaVaga {
  id: string;
  dataHora: Date;
  tipoEvento: TipoEventoAgenda;
  localizacao?: Localizacao;
  link?: string;

  vagaId: string;
  vaga: Vaga;

  localizacaoId?: string;
  etapaAtualId?: string;
  etapaAtual?: ProcessoSeletivoEtapa;
}

export interface CandidaturaVaga {
  id: string;
  candidatoId: string;
  vagaId: string;
  status: StatusCandidatura;
  dataAplicacao: Date;
  observacoes?: string;

  candidato: Candidato;
  vaga: Vaga;
  etapaAtualId?: string;
  etapaAtual?: ProcessoSeletivoEtapa;
}

export interface Anexo {
  id: string;
  nomeArquivo: string;
  url: string;
  tipo?: string;
  tamanhoKb?: number;

  vagas: VagaAnexo[];
}

export interface VagaAnexo {
  vagaId: string;
  anexoId: string;

  vaga: Vaga;
  anexo: Anexo;
}

export interface Beneficio {
  id: string;
  nome: string;
  descricao?: string;

  vagaId?: string;
  vaga?: Vaga;
}
