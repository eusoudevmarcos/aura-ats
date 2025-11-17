import { z } from 'zod';

export const StatusCandidaturaEnum = z.enum([
  'APLICADO',
  'EM_ANALISE',
  'ENTREVISTA_AGENDADA',
  'ENTREVISTA_CONCLUIDA',
  'OFERTA_ENVIADA',
  'OFERTA_ACEITA',
  'OFERTA_RECUSADA',
  'DESCLASSIFICADO',
  'CONTRATADO',
]);

export const candidaturaVagaSchema = z.object({
  id: z.uuid().optional(),
  candidatoId: z.uuid('ID do candidato deve ser um UUID válido.'),
  vagaId: z.uuid('ID da vaga deve ser um UUID válido.'),
  status: StatusCandidaturaEnum.default('APLICADO'),
  dataAplicacao: z
    .preprocess(arg => {
      if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
      return arg;
    }, z.date())
    .default(new Date()),
  observacoes: z.string().nullable().optional(),
});

export type CandidaturaVagaInputZod = z.infer<typeof candidaturaVagaSchema>;
