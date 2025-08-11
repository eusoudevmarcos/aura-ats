// src/schemas/medicoSchema.ts
import { z } from "zod";

// Definição dos Enums baseados no seu Prisma Schema
export const TipoUsuarioSchema = z.enum([
  "ADMIN",
  "MODERADOR",
  "ATENDENTE",
  "PROFISSIONAL",
]);
export const AreaProfissionalSchema = z.enum([
  "MEDICO",
  "ENFERMAGEM",
  "TECNOLOGIA",
  "OUTRO",
]);

export const ProfissionalInputSchema = z.object({
  crm: z.string().min(1, "O CRM é obrigatório."),
  rqe: z.string().optional(),
  area: AreaProfissionalSchema,

  usuario: z.object({
    nome: z
      .string()
      .min(3, "O nome do usuário deve ter pelo menos 3 caracteres."),
    cpf: z
      .string()
      .regex(
        /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        "O CPF do usuário é inválido (formato: 000.000.000-00)."
      ),
    email: z.string().email("O email do usuário é inválido."),
    tipo: TipoUsuarioSchema,
  }),

  funcionario: z
    .object({
      setor: z.string().optional(),
      cargo: z.string().optional(),
    })
    .optional(),
  especialidadeIds: z.array(z.number()).optional(),
  hospitalIds: z.array(z.string()).optional(),

  contatos: z
    .object({
      telefone: z.string().optional(),
      email: z.string().email("O email de contato é inválido.").optional(),
      whatsapp: z.string().optional(),
    })
    .optional(),

  localizacao: z
    .object({
      cidade: z.string().min(1, "A cidade é obrigatória."),
      estado: z
        .string()
        .length(2, "O estado deve ter 2 caracteres (UF).")
        .toUpperCase(),
    })
    .optional(),

  formacao: z
    .object({
      data_conclusao_medicina: z.string().optional(),
      data_conclusao_residencia: z.string().optional(),
    })
    .optional(),
});
export type ProfissionalInput = z.infer<typeof ProfissionalInputSchema>;
