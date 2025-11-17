import {
  AreaCandidato,
  Candidato,
  Especialidade,
  Medico,
  Pessoa,
} from "@prisma/client";
import { BuildNestedOperation } from "./buildNestedOperation";

// Este método extrai sub propriedades de objetos aninhados para transformar no padrão do prisma (create, update, connect).
// connect: objetos aninhado que só tem id,
// -- ex1: const pessoa = { id: "HASH" }
// -- ex2: const pessoa = [ id: "HASH" ]
// -- ex2: const pessoa = cliente.id
export default function candidatoBuild(
  candidatoData: Candidato & {
    pessoa: Pessoa;
    especialidade: Especialidade;
    medico: Medico;
  }
) {
  const buildNestedOperation = new BuildNestedOperation();

  // Extraia os objetos da raiz para não dar erro
  let newCandidato = {
    id: candidatoData?.id,
    corem: candidatoData.corem,
    areaCandidato: candidatoData.areaCandidato as AreaCandidato,
    emails: candidatoData?.emails || [],
    contatos: candidatoData?.contatos || [],
    links: candidatoData?.links || [],
  } as any;

  const { id, areaCandidato, corem, emails, contatos, ...rest } = candidatoData;

  if (rest.pessoa) {
    newCandidato.pessoa = buildNestedOperation.build(rest.pessoa);
  }

  if (rest.medico) {
    newCandidato.medico = buildNestedOperation.build(rest.medico);
  }

  if (rest.especialidade || rest.especialidadeId) {
    if (rest.especialidadeId) {
      rest.especialidade = {
        ...(rest.especialidade ?? {}),
        id: rest.especialidadeId,
      };
    }
    newCandidato.especialidade = buildNestedOperation.build(rest.especialidade);
  }

  return newCandidato;
}
