import z from "zod";

export const localizacaoSchema = z.object({
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z
    .string()
    .length(2, "UF deve conter 2 letras")
    .transform((s) => s.toUpperCase()),
});
export type LocalizacaoInput = z.infer<typeof localizacaoSchema>;
