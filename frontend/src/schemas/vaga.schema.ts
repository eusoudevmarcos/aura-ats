// src/schemas/vaga.schema.ts
import { z } from "zod";
import { zDateValidate } from "./util/dateValidation";

export const CategoriaVagaEnum = z.enum([
  "TECNOLOGIA",
  "SAUDE",
  "ADMINISTRATIVO",
  "FINANCEIRO",
  "RECURSOS_HUMANOS",
  "MARKETING",
  "VENDAS",
  "OUTROS",
]);
export type CategoriaVagaEnum = z.infer<typeof CategoriaVagaEnum>;

export const StatusVagaEnum = z.enum([
  "ATIVA",
  "PAUSADA",
  "ENCERRADA",
  "ARQUIVADA",
]);
export type StatusVagaEnum = z.infer<typeof StatusVagaEnum>;

export const TipoContratoEnum = z.enum([
  "CLT",
  "PJ",
  "ESTAGIO",
  "FREELANCER",
  "TEMPORARIO",
]);
export type TipoContratoEnum = z.infer<typeof TipoContratoEnum>;

export const NivelExperienciaEnum = z.enum([
  "ESTAGIO",
  "JUNIOR",
  "PLENO",
  "SENIOR",
  "ESPECIALISTA",
  "GERENTE",
]);
export type NivelExperienciaEnum = z.infer<typeof NivelExperienciaEnum>;

export const vagaSchema = z.object({
  id: z.string().optional(),
  titulo: z.string().min(3, "O título da vaga é obrigatório."),
  descricao: z
    .string()
    .min(20, "A descrição da vaga deve ter no mínimo 20 caracteres."),
  requisitos: z.string().optional(),
  responsabilidades: z.string().optional(),
  localizacao: z.string().optional(),
  categoria: CategoriaVagaEnum.optional(),
  status: StatusVagaEnum.default("ATIVA").optional(),
  tipoContrato: TipoContratoEnum.default("CLT").optional(),
  nivelExperiencia: NivelExperienciaEnum.default("JUNIOR").optional(),
  salarioMinimo: z
    .number()
    .positive("O salário mínimo deve ser um valor positivo.")
    .nullable()
    .optional(),
  salarioMaximo: z
    .number()
    .positive("O salário máximo deve ser um valor positivo.")
    .nullable()
    .optional(),
  create_at: zDateValidate,
  dataFechamento: zDateValidate,
  dataPublicacao: zDateValidate,

  empresaId: z
    .string()
    .min(1, "A vaga deve estar associada a uma empresa.")
    .nullable()
    .optional(),
});

export type VagaInput = z.infer<typeof vagaSchema>;
