import z from "zod";

export const StatusClienteEnum = z.enum([
  "ATIVO",
  "INATIVO",
  "PENDENTE",
  "LEAD",
]);
export type StatusClienteEnumInput = z.infer<typeof StatusClienteEnum>;
