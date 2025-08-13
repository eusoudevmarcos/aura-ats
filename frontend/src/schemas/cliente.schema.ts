import { z } from "zod";
import { empresaSchema } from "./empresa.schema";
import { TipoServicoEnum } from "./tipoServicoEnum.schema";
import { StatusClienteEnum } from "./statusClienteEnum.schema";

export const clienteSchema = z
  .object({
    id: z.uuid().optional(),
    empresaId: z.string().optional(),
    empresa: empresaSchema,
    tipoServico: z
      .array(TipoServicoEnum)
      .min(1, "Selecione ao menos um serviço"),

    // profissionalId: z.string().uuid().optional(),
    status: StatusClienteEnum,
  })
  .refine((data) => !!data.empresaId || !!data.empresa, {
    message: "Informe uma empresa existente ou cadastre uma nova",
    path: ["empresaId"],
  });

export type ClienteInput = z.infer<typeof clienteSchema>;
