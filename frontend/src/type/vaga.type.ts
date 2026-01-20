// Importe os enums e modelos relacionados do seu Prisma Client
// Certifique-se de que o seu @prisma/client está gerado e acessível.

import { AreaCandidato } from '@/dto/dataStoneCandidato.dto';
import { Agenda } from './agenda.type';
import { CandidaturaVaga } from './candidaturaVaga.type';
import { Cliente } from './cliente.type';

export type VagaInput = {
  id?: string;
  titulo: string;
  descricao: string;
  areaCandidato: AreaCandidato;
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
  areaCandidato: AreaCandidato;
  clienteId: string;
  cliente: Cliente;
  agendaId: string;
  agenda: Agenda;
  candidaturasVaga: CandidaturaVaga[];
};
