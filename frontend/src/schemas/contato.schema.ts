import z from "zod";

export const contatoSchema = z.object({
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.email("Email inválido").optional(),
});
export type ContatoInput = z.infer<typeof contatoSchema>;
