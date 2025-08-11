import z from "zod";

export const StatusClienteEnum = z.enum([
  "ATIVO",
  "INATIVO",
  "PENDENTE",
  "LEAD",
]);
export type StatusCliente = z.infer<typeof StatusClienteEnum>;
