import { z } from "zod";
import { contatoSchema } from "./contato.schema";
import { localizacaoSchema } from "./localizacao.schema";
import { formacaoSchema } from "./formacao.schame";
import { zDateValidate } from "./util/dateValidation";
import { isValidCPF } from "@/utils/validateCpf";

export const pessoaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine(
      (val) => {
        // Remove a máscara antes de validar
        const unmaskedCpf = val.replace(/\D/g, "");
        return isValidCPF(unmaskedCpf);
      },
      {
        message: "CPF inválido",
      }
    ),
  dataNascimento: zDateValidate.optional(),
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
  rg: z.string().optional(),
  contatos: z.array(contatoSchema),
  localizacoes: z.array(localizacaoSchema).optional(),
  formacoes: z.array(formacaoSchema).optional(),
});

export type PessoaInput = z.infer<typeof pessoaSchema>;
