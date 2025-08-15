import { Candidato } from "./candidato.type";

export interface Especialidade {
  id?: number;
  nome: string;
  sigla: string;
  candidato: Candidato[];
}
