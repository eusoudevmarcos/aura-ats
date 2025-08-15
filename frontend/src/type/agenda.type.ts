import { Candidato } from "./candidato.type";
import { Vaga } from "./vaga.type";

// src/types/agenda.type.ts
export type AgendaInput = {
  id?: string;
  dataHoraInicio: Date | string;
  dataHoraFim: Date | string;
  titulo: string;
  descricao?: string | null;
  candidatoId?: string | null;
  vagaId?: string | null;
  local?: string | null;
  linkReuniao?: string | null;
};

export type Agenda = {
  id: string;
  dataHoraInicio: Date;
  dataHoraFim: Date;
  titulo: string;
  descricao: string | null;
  candidatoId: string | null;
  candidato: Candidato | null;
  vagaId: string | null;
  vaga: Vaga | null;
  local: string | null;
  linkReuniao: string | null;
  createdAt: Date;
  updatedAt: Date;
};
