import z from "zod";

export const EstadoCivilEnum = z.enum([
  "SOLTEIRO",
  "CASADO",
  "DIVORCIADO",
  "VIUVO",
  "SEPARADO",
  "UNIAO_ESTAVEL",
]);
export type EstadoCivil = z.infer<typeof EstadoCivilEnum>;
