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
  dataInscricao: z.union([
    z
      .string()
      .refine(
        val =>
          /^\d{2}\/\d{2}\/\d{4}$/.test(val) ||
          /^\d{4}-\d{2}-\d{2}(T.*Z)?$/.test(val),
        {
          message:
            'Data deve estar no formato DD/MM/AAAA ou ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)',
        }
      ),
    z.date(),
  ]),
});

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
});

export const candidatoSchema = z.object({
  id: z.uuid().optional(),
  pessoa: pessoaSchema,
  areaCandidato: AreaCandidatoEnum,
  // sexo: SexoEnum.nullable(),
  // signo: SignoEnum.nullable(),
  // crm: z.array(
  //   z
  //     .string()
  //     .regex(/^\d{1,7}\/?[A-Z]{0,2}$/, {
  //       message:
  //         'CRM deve conter apenas números e opcionalmente a sigla do estado (ex: 123456/SP)',
  //     })
  //     .max(20)
  // ), // Sigla do estado na frente
  corem: z
    .string()
    .regex(/^([A-Z]{2}\s?\d{1,10}|\d{1,10}-[A-Z]{2})$/, {
      message:
        "COREN deve estar no formato 'XX 123456' ou '123456-XX' (ex: MG 123456)",
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

  links: z.array(z.url()),

  contatos: z.array(z.string()),
  // formacoes: z.array(formacaoSchema).optional(),
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

  medico: medicoSchema,
});

export type CandidatoInput = z.infer<typeof candidatoSchema>;
