// funcionario.schema.ts
import { z } from 'zod';
import { empresaSchema } from './empresa.schema';
import { pessoaSchema } from './pessoa.schema';

export const TipoUsuarioEnum = z.enum(
  [
    'ADMIN_SISTEMA',
    'ADMINISTRATIVO',
    'MODERADOR',
    'RECRUTADOR',
    'VENDEDOR',
    'CLIENTE_ATS',
    'CLIENTE_CRM',
    'CLIENTE_ATS_CRM',
  ],
  { error: 'Selecione o tipo de Usuario' }
);

export type TipoUsuario = z.infer<typeof TipoUsuarioEnum>;

// Schema base
export const funcionarioSchema = z.object({
  id: z.string().nullable().optional(),
  tipoUsuario: TipoUsuarioEnum,
  email: z.email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  funcionario: z
    .object({
      id: z.string().nullable().optional(),
      setor: z.string().optional(),
      cargo: z.string().optional(),
      pessoa: pessoaSchema.optional(),
      pessoaId: z.uuid().optional(),
    })
    .optional(),
  cliente: z.object({
    empresa: empresaSchema.optional(),
    empresaId: z.uuid().optional(),
  }),
  tipoPessoaOuEmpresa: z.enum(['funcionario.pessoa', 'cliente.empresa']),
});

export type FuncionarioInput = z.infer<typeof funcionarioSchema>;
