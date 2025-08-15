// Importe os enums e modelos relacionados do seu Prisma Client
// Certifique-se de que o seu @prisma/client está gerado e acessível.

import { AreaCandidatoEnum } from "@/schemas/candidato.schema";
import { Cliente } from "./cliente.type";
import { CandidaturaVaga } from "./candidaturaVaga.type";
import { Agenda } from "./agenda.type";

export type VagaInput = {
  id?: string;
  titulo: string;
  descricao: string;
  areaCandidato: AreaCandidatoEnum;
  clienteId: string;
  agendaId: string;
  candidaturaVaga?: CandidaturaVaga[];
};

export type Vaga = {
  id: string;
  titulo: string;
  descricao: string;
  create_at: Date;
  update_at: Date;
  areaCandidato: AreaCandidatoEnum;
  clienteId: string;
  cliente: Cliente;
  agendaId: string;
  agenda: Agenda;
  candidaturasVaga: CandidaturaVaga[];
};
