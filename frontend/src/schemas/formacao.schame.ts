import z from "zod";

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
export type FormacaoInput = z.infer<typeof formacaoSchema>;
