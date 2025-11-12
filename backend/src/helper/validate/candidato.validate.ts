import { AreaCandidato } from "@prisma/client";
import prisma from "../../lib/prisma";

export async function validateBasicFieldsCandidato(data: any) {
  if (!data.id && data?.pessoa?.cpf && data.pessoa.cpf !== "") {
    const existingPessoaByCpf = await prisma.pessoa.findFirst({
      where: { cpf: data.pessoa.cpf },
    });

    if (existingPessoaByCpf) {
      throw new Error("Candidato já existe");
    }
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
