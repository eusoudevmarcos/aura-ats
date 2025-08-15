export enum StatusCandidatura {
  APLICADO, // Candidato se candidatou
  EM_ANALISE, // Aplicação em revisão
  ENTREVISTA_AGENDADA, // Entrevista marcada
  ENTREVISTA_CONCLUIDA, // Entrevista realizada
  OFERTA_ENVIADA, // Oferta de emprego enviada
  OFERTA_ACEITA, // Candidato aceitou a oferta
  OFERTA_RECUSADA, // Candidato recusou a oferta
  DESCLASSIFICADO, // Candidato não avançou no processo
  CONTRATADO, // Candidato foi contratado (pode ser um status final)
}

export type CandidaturaVaga = {
  id?: string;
  candidatoId: string;
  vagaId: string;
  status?: StatusCandidatura;
  dataAplicacao?: Date | string;
  observacoes?: string | null;
};
