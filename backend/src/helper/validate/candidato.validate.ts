import { AreaCandidato } from "@prisma/client";
import prisma from "../../lib/prisma";

export async function validateBasicFieldsCandidato(data: any) {
  // if (!data.pessoa || !data.pessoa.cpf) {
  //   throw new Error(
  //     "Dados da pessoa e CPF são obrigatórios para um candidato."
  //   );
  // }

  const cpfLimpo = data.pessoa.cpf.replace(/\D/g, "");
  const existingPessoaByCpf = await prisma.pessoa.findFirst({
    where: { cpf: cpfLimpo },
  });

  if (existingPessoaByCpf) {
    throw new Error("Candidato já existe");
  }

  if (!data.areaCandidato) {
    throw new Error("A área do candidato é obrigatória.");
  }

  if (!Object.values(AreaCandidato).includes(data.areaCandidato)) {
    throw new Error(`Área do candidato inválida: ${data.areaCandidato}`);
  }

  if (!!data.especialidadeId && data.especialidadeId !== "") {
    data.especialidadeId = Number(data.especialidadeId);
  }
}
