import z from "zod";

export const StatusClienteEnum = z.enum([
  "PROSPECT",
  "LEAD",
  "ATIVO",
  "INATIVO",
]);

export type StatusClienteEnumInput = z.infer<typeof StatusClienteEnum>;
