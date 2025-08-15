import { AreaCandidatoEnum } from "@/schemas/candidato.schema";
import { Pessoa } from "./pessoa.type";
import { Especialidade } from "./especialidade.type";
import { Vaga } from "./vaga.type";

export type CandidatoInput = {
  id?: string;
  areaCandidato: AreaCandidatoEnum;
  pessoa:
    | { id: string }
    | Omit<Pessoa, "id" | "createdAt" | "updatedAt" | "empresaRepresentadaId">;
  crm?: string | null;
  corem?: string | null;
  rqe?: string | null;
  especialidade?:
    | { id: number }
    | { nome: string; sigla?: string | null }
    | null;
  especialidadeId?: number | null;
  agendaId?: string | null;
  vagas?: string[];
  formacoes?: Array<{
    id?: string;
    dataConclusaoMedicina?: Date | string | null;
    dataConclusaoResidencia?: Date | string | null;
  }>;
};

export type Candidato = {
  id: string;
  areaCandidato: AreaCandidatoEnum;
  pessoaId: string;
  pessoa: Pessoa;
  crm: string | null;
  corem: string | null;
  rqe: string | null;
  especialidade: Especialidade | null;
  especialidadeId: number | null;
  agendaId: string | null;
  vagas: Vaga[];
  formacoes: Formacao[];
  // createdAt?: Date; // Adicione se você tiver timestamps automáticos
  // updatedAt?: Date; // Adicione se você tiver timestamps automáticos
};
