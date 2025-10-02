import { VagaSaveInput } from "../../types/vaga.type";

export const normalizeData = (data: VagaSaveInput) => {
  return {
    ...data,
    titulo: data.titulo?.trim(),
    responsabilidades: data.responsabilidades?.trim(),
    // Normalizar arrays removendo itens vazios/inválidos
    beneficios:
      data.beneficios?.filter((b: any) => b && (b.nome || b.id)) || [],
    habilidades:
      data.habilidades?.filter((h: any) => h && (h.nome || h.id)) || [],
    anexos: data.anexos?.filter((a: any) => a && (a.anexoId || a.id)) || [],
    triagens:
      data.triagens
        ?.filter((t: any) => t && (t.tipoTriagem || t.id))
        ?.slice(0, 4) || [],
  };
};
