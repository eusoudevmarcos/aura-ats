import { UF_MODEL } from "@/utils/UF";
import z from "zod";

export const localizacaoSchema = z.object({
  cep: z.string().length(8, "CEP deve ter 8 caracteres").optional(),
  cidade: z.string().min(1, "Cidade é obrigatória").optional(),
  bairro: z.string(),
  uf: z
    .string({
      error: (issue) => {
        if (issue.input === undefined || issue.input === "") {
          return "UF é obrigatória";
        }
        if (typeof issue.input !== "string") {
          return "UF inválida";
        }
        return undefined; // segue com validações abaixo
      },
    })
    .transform((s) => s.toUpperCase())
    .refine((val) => val !== "", {
      error: "UF é obrigatória",
    })
    .refine((val) => UF_MODEL.some(({ value }) => value === val), {
      message: "UF inválida",
    })
    .optional(),
  estado: z
    .string({
      error: (issue) => {
        if (issue.input === undefined || issue.input === "") {
          return "Estado é obrigatória";
        }
        if (typeof issue.input !== "string") {
          return "Estado inválida";
        }
        return undefined; // segue com validações abaixo
      },
    })
    .transform((s) => s.toUpperCase())
    .refine((val) => val !== "", {
      error: "Estado é obrigatória",
    })
    .refine((val) => UF_MODEL.some(({ value }) => value === val), {
      message: "Estado inválida",
    })
    .optional(),
  regiao: z
    .string()
    .length(2, "Região deve ter pelo menos 2 caracteres")
    .transform((s) => s.toUpperCase())
    .optional(),
  complemento: z.string().optional(),
  logradouro: z.string().optional(),
  // descricao: z.string().optional(),
});
export type LocalizacaoInput = z.infer<typeof localizacaoSchema>;
