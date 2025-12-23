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

export const crmSchema = z.object({
  id: z.uuid().optional(),
  numero: z.string(),
  ufCrm: z.string().max(2),
  dataInscricao: z.string(),
});

export const EspecialidadeMedicoSchema = z.object({
  id: z.uuid().optional(),
  rqe: z.string().max(20),
  especialidadeId: z.union([z.string(), z.number()]),
});

export type EspecialidadeMedicoInput = z.infer<
  typeof EspecialidadeMedicoSchema
>;

export const medicoSchema = z.object({
  id: z.uuid().optional().nullable(),
  rqe: z
    .string()
    .regex(/^\d{1,6}$/, {
      message: 'RQE deve conter apenas números (ex: 54321)',
    })
    .max(20)
    .nullable()
    .optional(),
  crm: z.array(crmSchema).optional(),
  quadroSocietario: z.union([z.string(), z.boolean()]).optional().nullable(),
  quadroDeObservações: z.string().optional().nullable(),
  exames: z.string().optional().nullable(),
  especialidadesEnfermidades: z.string().optional().nullable(),
  porcentagemRepasseMedico: z.string().optional().nullable(),
  porcentagemConsultas: z.string().optional().nullable(),
  porcentagemExames: z.string().optional().nullable(),
  especialidades: z.array(EspecialidadeMedicoSchema).optional(),
});

export const candidatoSchema = z
  .object({
    id: z.uuid().optional(),
    pessoa: pessoaSchema,
    areaCandidato: AreaCandidatoEnum,
    corem: z
      .string()
      .regex(/^([A-Z]{2}\s?\d{1,10}|\d{1,10}-[A-Z]{2})$/, {
        message:
          "COREN deve estar no formato 'XX 123456' ou '123456-XX' (ex: MG 123456)",
      })
      .max(20)
      .nullable()
      .optional(),

    emails: z.array(z.string()),

    links: z.array(z.url()),

    contatos: z.array(z.string()),
    anexos: z
      .array(
        z.object({
          anexo: z.object({
            nomeArquivo: z.string(),
            mimetype: z.string().optional(),
            tamanhoKb: z.number().optional(),
            tipo: z.string(),
            url: z.string().optional().nullable(),
            fileObj: z.any().optional(), // File object do browser
          }),
          anexoId: z.string().optional(),
          candidatoId: z.string().optional(),
        })
      )
      .optional(),

    medico: medicoSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.areaCandidato === 'MEDICO' && !data.medico) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "O campo 'medico' é obrigatório quando área do candidato for 'MEDICO'.",
        path: ['medico'],
      });
    }
  });

export type CandidatoInput = z.infer<typeof candidatoSchema>;
