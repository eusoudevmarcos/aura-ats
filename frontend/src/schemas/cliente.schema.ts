import { z } from 'zod';
import { empresaSchema } from './empresa.schema';
import { StatusClienteEnum } from './statusClienteEnum.schema';
import { TipoServicoEnum } from './tipoServicoEnum.schema';

export const clienteSchema = z.object({
  id: z.uuid().optional(),
  empresaId: z.uuid().optional(),
  empresa: empresaSchema,
  tipoServico: z
    .array(TipoServicoEnum)
    .min(1, 'Selecione ao menos um serviço')
    .optional(),

  // profissionalId: z.string().uuid().optional(),
  status: StatusClienteEnum,
});

export type ClienteInput = z.infer<typeof clienteSchema>;
