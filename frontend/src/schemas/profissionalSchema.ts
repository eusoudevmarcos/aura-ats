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

// Esquema Zod para MedicoInput
export const ProfissionalInputSchema = z.object({
  crm: z.string().min(1, "O CRM é obrigatório."),
  rqe: z.string().optional(), // RQE é opcional
  area: AreaProfissionalSchema, // Usa o enum definido acima

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
    tipo: TipoUsuarioSchema, // Usa o enum definido acima
  }),

  funcionario: z
    .object({
      setor: z.string().optional(),
      cargo: z.string().optional(),
    })
    .optional(), // O objeto 'funcionario' completo é opcional

  especialidadeIds: z.array(z.number()).optional(), // Array de números (IDs de especialidades)
  hospitalIds: z.array(z.string()).optional(), // Array de strings (IDs de hospitais)

  contatos: z
    .object({
      telefone: z.string().optional(),
      email: z.string().email("O email de contato é inválido.").optional(),
      whatsapp: z.string().optional(),
    })
    .optional(), // O objeto 'contatos' completo é opcional

  localizacao: z
    .object({
      cidade: z.string().min(1, "A cidade é obrigatória."), // Cidade é obrigatória se 'localizacao' existir
      estado: z
        .string()
        .length(2, "O estado deve ter 2 caracteres (UF).")
        .toUpperCase(),
    })
    .optional(), // O objeto 'localizacao' completo é opcional

  formacao: z
    .object({
      // Para inputs type="date", eles retornam strings no formato "YYYY-MM-DD"
      // z.string().datetime() valida uma string no formato ISO 8601 (ex: "2023-10-27T10:00:00Z")
      // Se o input type="date" retornar "YYYY-MM-DD", você pode precisar de z.string().regex ou z.string().pipe(z.coerce.date())
      data_conclusao_medicina: z.string().optional(),
      data_conclusao_residencia: z.string().optional(),
    })
    .optional(), // O objeto 'formacao' completo é opcional
});

// Inferir o tipo TypeScript a partir do esquema Zod
export type ProfissionalInput = z.infer<typeof ProfissionalInputSchema>;
