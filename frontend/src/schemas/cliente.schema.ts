import { z } from 'zod';
import { empresaSchema } from './empresa.schema';
import { StatusClienteEnum } from './statusClienteEnum.schema';
import { TipoServicoEnum } from './tipoServicoEnum.schema';
import { vagaSchema } from './vaga.schema';

// Cliente
export const clienteSchema = z.object({
  id: z.uuid().optional(),
  status: StatusClienteEnum,
  tipoServico: z
    .array(TipoServicoEnum)
    .min(1, 'Selecione ao menos um serviço')
    .optional(),
});
export type ClienteInput = z.infer<typeof clienteSchema>;

// Cliente + Vagas
export const clienteWithVagasSchema = clienteSchema.extend({
  vagas: z.array(z.lazy(() => vagaSchema)).optional(),
  vagaId: z.uuid(),
});
export type ClienteWithVagasInput = z.infer<typeof clienteWithVagasSchema>;

// Cliente + Empesa
export const clienteWithEmpresaSchema = clienteSchema.extend({
  empresaId: z.uuid().optional(),
  empresa: empresaSchema,
});
export type ClienteWithEmpresaInput = z.infer<typeof clienteWithEmpresaSchema>;

// Cliente + Empesa + Vaga
export const clienteWithEmpresaAndVagaSchema = clienteSchema.extend({
  empresaId: z.uuid().optional(),
  empresa: empresaSchema,
  vagas: z.array(z.lazy(() => vagaSchema)).optional(),
  vagaId: z.uuid(),
});
export type ClienteWithEmpresaAndVagaInput = z.infer<
  typeof clienteWithEmpresaAndVagaSchema
>;
