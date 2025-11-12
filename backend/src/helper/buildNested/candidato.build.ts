import {
  AreaCandidato,
  Candidato,
  Especialidade,
  Pessoa,
} from "@prisma/client";
import { BuildNestedOperation } from "./buildNestedOperation";

export default function candidatoBuild(
  candidatoData: Candidato & {
    pessoa: Pessoa;
    especialidade: Especialidade;
  }
) {
  const buildNestedOperation = new BuildNestedOperation();

  let newCandidato = {
    id: candidatoData?.id,
    rqe: candidatoData.rqe,
    crm: candidatoData.crm,
    corem: candidatoData.corem,
    areaCandidato: candidatoData.areaCandidato as AreaCandidato,
    emails: candidatoData?.emails || [],
    contatos: candidatoData?.contatos || [],
  } as any;

  const { id, rqe, areaCandidato, crm, corem, emails, contatos, ...rest } =
    candidatoData;

  if (rest.pessoa) {
    newCandidato.pessoa = buildNestedOperation.build(rest.pessoa);
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

  //   if (rest.formacoes || rest.formacoes) {
  //     newCandidato.formacoes = buildNestedOperation.build(rest.formacoes);
  //   }

  return newCandidato;
}
