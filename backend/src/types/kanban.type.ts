import { TipoEntidade } from "@prisma/client";
import { Pagination } from "./pagination";

export interface EspacoTrabalhoInput {
  nome: string;
}

export interface QuadroKanbanInput {
  titulo: string;
  espacoTrabalhoId: string;
}

export interface ColunaKanbanInput {
  titulo: string;
  ordem?: number;
  quadroKanbanId: string;
}

export interface CardKanbanInput {
  titulo: string;
  descricao?: string;
  ordem?: number;
  colunaKanbanId: string;
}

export interface MoverCardInput {
  cardId: string;
  novaColunaId: string;
  ordemSuperior?: number;
  ordemInferior?: number;
  novaPosicao?: number; // Posição na lista (0-based)
}

export interface MoverColunaInput {
  colunaId: string;
  novaPosicao: number; // Posição na lista (0-based)
}

export interface VincularEntidadeInput {
  cardId: string;
  entidadeId: string;
  tipoEntidade: TipoEntidade;
}

export interface ComentarioCardInput {
  cardKanbanId: string;
  conteudo: string;
}

export interface KanbanGetAllQuery extends Pagination {
  espacoTrabalhoId?: string;
  quadroKanbanId?: string;
}
