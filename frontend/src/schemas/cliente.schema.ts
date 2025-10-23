import { z } from 'zod';
import { empresaSchema } from './empresa.schema';
import { planoAssinaturaSchema } from './plano.schema';
import { StatusClienteEnum } from './statusClienteEnum.schema';
import { vagaSchema } from './vaga.schema';

// Cliente
export const clienteSchema = z.object({
  id: z.uuid().optional(),
  status: StatusClienteEnum,
  planos: z.array(z.string()).optional(), // IDs dos planos selecionados
  criarUsuarioSistema: z.boolean().optional(),
  usuarioSistema: z
    .object({
      email: z.email().optional(),
      password: z.string().optional(),
    })
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

// export const clienteWithEmpresaAndPlanosSchema = z.object({
//   ...clienteWithEmpresaSchema,
//   ...planoSchema,
// });

export const clienteWithEmpresaAndPlanosSchema =
  clienteWithEmpresaSchema.extend({
    planos: z.union([z.array(planoAssinaturaSchema), z.array(z.string())]),
  });

export type ClienteWithEmpresaAndPlanosSchema = z.infer<
  typeof clienteWithEmpresaAndPlanosSchema
>;

// Cliente + Empesa + Vaga
export const clienteWithEmpresaAndVagaSchema = clienteSchema.extend({
  empresaId: z.uuid().optional(),
  empresa: empresaSchema,
  vagas: z.array(z.lazy(() => vagaSchema)).optional(),
  vagaId: z.uuid(),
  usuarioSistema: z.object({ email: z.string() }).optional(),
  planos: z.array(planoAssinaturaSchema).optional(), // Planos com detalhes
});

export type ClienteWithEmpresaAndVagaInput = z.infer<
  typeof clienteWithEmpresaAndVagaSchema
>;
