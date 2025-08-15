// src/schemas/candidato.schema.ts
import { z } from "zod";
import { pessoaSchema } from "./pessoa.schema";

export const AreaCandidatoEnum = z.enum([
  "MEDICINA",
  "ENFERMAGEM",
  "FISIOTERAPIA",
  "ODONTOLOGIA",
  "PSICOLOGIA",
  "FARMACIA",
  "NUTRICIONISTA",
  "BIOMEDICINA",
  "OUTROS",
]);
export type AreaCandidatoEnum = z.infer<typeof AreaCandidatoEnum>;

export const especialidadeSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome da especialidade é obrigatório"),
  sigla: z.string().max(10).optional(),
});

export const formacaoSchema = z.object({
  id: z.string().optional(),
  // dataConclusaoMedicina: z
  //   .preprocess((arg) => {
  //     if (arg === null || arg === undefined || arg === "") return undefined;
  //     if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  //     return arg;
  //   }, z.date().optional())
  //   .optional()
  //   .nullable()
  //   .nullish(),

  dataConclusaoResidencia: z
    .preprocess((arg) => {
      if (arg === null || arg === undefined || arg === "") return undefined;
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    }, z.date().optional())
    .optional(),
});

export const candidatoSchema = z.object({
  id: z.string().optional(),
  areaCandidato: AreaCandidatoEnum,
  crm: z.string().max(20).nullable().optional(),
  corem: z.string().max(20).nullable().optional(),
  rqe: z.string().max(20).nullable().optional(),
  especialidade: especialidadeSchema.optional(),
  especialidadeId: z.number().nullable().optional(),
  pessoa: pessoaSchema,
  formacoes: z.array(formacaoSchema),
});

export type CandidatoInput = z.infer<typeof candidatoSchema>;
