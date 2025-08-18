// src/schemas/candidato.schema.ts
import { z } from "zod";
import { pessoaSchema } from "./pessoa.schema";

const areaCandidato = ["MEDICINA", "ENFERMAGEM", "OUTROS"];

export const AreaCandidatoEnum = z.enum(areaCandidato, {
  error: "Area de atuação é obrigatório",
});
export type AreaCandidatoEnum = z.infer<typeof AreaCandidatoEnum>;

export const especialidadeSchema = z.object({
  id: z.string(),
  nome: z.string().min(1, "Nome da especialidade é obrigatório"),
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
  id: z.string().optional(),
  pessoa: pessoaSchema,
  areaCandidato: z
    .enum(areaCandidato, {
      error: "Area candidato e obrigatorio",
    })
    .optional(),
  crm: z.string().max(20).nullable().optional(),
  corem: z.string().max(20).nullable().optional(),
  rqe: z.string().max(20).nullable().optional(),
  especialidadeId: z
    .string()
    // .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    //   message: "Especialidade invalida",
    // })
    // .transform((val) => Number(val))
    .optional()
    .nullable(),
  // formacoes: z.array(formacaoSchema),
});

export type CandidatoInput = z.infer<typeof candidatoSchema>;
