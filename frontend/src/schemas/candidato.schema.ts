// src/schemas/candidato.schema.ts
import { z } from 'zod';
import { pessoaSchema } from './pessoa.schema';

const areaCandidato = ['MEDICINA', 'ENFERMAGEM', 'OUTRO'];

export const AreaCandidatoEnum = z.enum(areaCandidato, {
  error: 'Area de atuação é obrigatório',
});
export type AreaCandidatoEnum = z.infer<typeof AreaCandidatoEnum>;

export const especialidadeSchema = z.object({
  id: z.string(),
  nome: z.string().min(1, 'Nome da especialidade é obrigatório'),
  sigla: z.string().max(10).optional(),
});

// export const formacaoSchema = z.object({
//   id: z.string().optional(),
// dataConclusaoMedicina: z
//   .preprocess((arg) => {
//     if (arg === null || arg === undefined || arg === "") return undefined;
//     if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
//     return arg;
//   }, z.date().optional())
//   .optional()
//   .nullable()
//   .nullish(),

//   dataConclusaoResidencia: z
//     .preprocess((arg) => {
//       if (arg === null || arg === undefined || arg === "") return undefined;
//       if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
//       return arg;
//     }, z.date().optional())
//     .optional(),
// });
export const candidatoSchema = z.object({
  id: z.uuid().optional(),
  pessoa: pessoaSchema,
  areaCandidato: AreaCandidatoEnum,
  crm: z.array(
    z
      .string()
      .regex(/^\d{1,7}\/?[A-Z]{0,2}$/, {
        message:
          'CRM deve conter apenas números e opcionalmente a sigla do estado (ex: 123456/SP)',
      })
      .max(20)
  ), // Sigla do estado na frente
  corem: z
    .string()
    .regex(/^([A-Z]{2}\s?\d{1,10}|\d{1,10}-[A-Z]{2})$/, {
      message:
        "COREN deve estar no formato 'XX 123456' ou '123456-XX' (ex: MG 123456)",
    })
    .max(20)
    .nullable()
    .optional(),
  rqe: z
    .string()
    .regex(/^\d{1,6}$/, {
      message: 'RQE deve conter apenas números (ex: 54321)',
    })
    .max(20)
    .nullable()
    .optional(),
  especialidadeId: z
    .string()
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Especialidade inválida',
    })
    .optional()
    .nullable(),
  emails: z.array(z.string()),
  contatos: z.array(z.string()),
  // formacoes: z.array(formacaoSchema).optional(),
});

export type CandidatoInput = z.infer<typeof candidatoSchema>;
