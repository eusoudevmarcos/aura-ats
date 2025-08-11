import z from "zod";

export const TipoUsuarioEnum = z.enum([
  "ADMIN",
  "MODERADOR",
  "ATENDENTE",
  "PROFISSIONAL",
]);

export type TipoUsuarioEnumInput = z.infer<typeof TipoUsuarioEnum>;
