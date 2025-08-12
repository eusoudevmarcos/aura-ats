import { z } from "zod";
import { contatoSchema } from "./contato.schema";
import { localizacaoSchema } from "./localizacao.schema";
import { pessoaSchema } from "./pessoa.schema";

export const empresaSchema = z.object({
  razaoSocial: z.string().min(1, "Razão Social é obrigatória"),
  cnpj: z
    .string()
    .min(18, "CNPJ inválido") // inclui pontos, barra e traço
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "Formato de CNPJ inválido"),

  dataAbertura: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), "Data inválida"),
  contatos: z.array(contatoSchema),
  localizacoes: z.array(localizacaoSchema).optional(),
  representante: z.array(pessoaSchema),
});

export type EmpresaInput = z.infer<typeof empresaSchema>;
