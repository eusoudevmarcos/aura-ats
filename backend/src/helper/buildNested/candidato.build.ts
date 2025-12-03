import {
  AreaCandidato,
  Candidato,
  EspecialidadeMedico,
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
    medico: Medico & { especialidades: EspecialidadeMedico[] };
  }
) {
  const buildNestedOperation = new BuildNestedOperation();

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

  return newCandidato;
}
