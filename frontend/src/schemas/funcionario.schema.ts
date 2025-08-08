import { z } from "zod";

// Schema Zod para validação
export const contatoSchema = z.object({
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.email().optional(),
});

export const localizacaoSchema = z.object({
  cidade: z.string().min(1, "Cidade é obrigatório"),
  estado: z.string().min(2, "Estado é obrigatório"),
});

export const formacaoSchema = z.object({
  dataConclusaoMedicina: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), "Data inválida"),
  dataConclusaoResidencia: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), "Data inválida"),
});

export const pessoaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve ter 11 números")
    .optional(),
  dataNascimento: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), "Data inválida"),
  estadoCivil: z
    .enum([
      "SOLTEIRO",
      "CASADO",
      "DIVORCIADO",
      "VIUVO",
      "SEPARADO",
      "UNIAO_ESTAVEL",
    ])
    .optional(),
  rg: z.string().regex(/^\d+$/, "RG deve conter só números").optional(),
  contatos: z.array(contatoSchema).optional(),
  localizacoes: z.array(localizacaoSchema).optional(),
  formacoes: z.array(formacaoSchema).optional(),
});

export const empresaSchema = z.object({
  razaoSocial: z.string().min(1, "Razão social é obrigatória"),
  cnpj: z.string().regex(/^\d{14}$/, "CNPJ deve ter 14 números"),
  dataAbertura: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), "Data inválida"),
  contatos: z.array(contatoSchema).optional(),
  localizacoes: z.array(localizacaoSchema).optional(),
});

export const funcionarioSchema = z.object({
  tipoUsuario: z.enum([
    "ADMIN",
    "MODERADOR",
    "ATENDENTE",
    "PROFISSIONAL",
    "FUNCIONARIO",
  ]),
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  setor: z.string().optional(),
  cargo: z.string().optional(),

  tipoPessoaOuEmpresa: z.enum(["pessoa", "empresa"]),

  pessoa: pessoaSchema.optional(),
  empresa: empresaSchema.optional(),
});
