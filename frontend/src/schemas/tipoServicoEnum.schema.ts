import z from "zod";

export const TipoServicoEnum = z.enum([
  "RECRUTAMENTO_CONTRATUAL",
  "RECRUTAMENTO_DISPARO_CURRICULO",
  "RECRUTAMENTO_INFORMACAO",
  "PLATAFORMA",
]);
export type TipoServicoEnumInput = z.infer<typeof TipoServicoEnum>;
