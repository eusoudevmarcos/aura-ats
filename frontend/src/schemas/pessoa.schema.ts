import { z } from "zod";
import { contatoSchema } from "./contato.schema";
import { localizacaoSchema } from "./localizacao.schema";
import { formacaoSchema } from "./formacao.schame";

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

export type PessoaSectionInput = z.infer<typeof pessoaSchema>;
export type ContatoInput = z.infer<typeof contatoSchema>;
export type LocalizacaoInput = z.infer<typeof localizacaoSchema>;
export type FormacaoInput = z.infer<typeof formacaoSchema>;
