import { VagaSaveInput } from "../../types/vaga.type";

export const validateBasicFields = (data: VagaSaveInput): void => {
  if (!data.titulo) {
    throw new Error("Título da vaga é obrigatório.");
  }

  if (!data.clienteId) {
    throw new Error("Cliente é obrigatório para a vaga.");
  }

  if (!data.localizacao && !data.localizacaoId) {
    throw new Error("Localização é obrigatória (dados ou ID).");
  }

  if (data.beneficios && !Array.isArray(data.beneficios)) {
    throw new Error("Benefícios deve ser um array.");
  }

  if (data.habilidades && !Array.isArray(data.habilidades)) {
    throw new Error("Habilidades deve ser um array.");
  }

  if (data.anexos && !Array.isArray(data.anexos)) {
    throw new Error("Anexos deve ser um array.");
  }
};
