import z from "zod";

export const TipoUsuarioEnum = z.enum([
  "ADMIN",
  "MODERADOR",
  "ATENDENTE",
  "PROFISSIONAL",
]);

export type TipoUsuario = z.infer<typeof TipoUsuarioEnum>;
