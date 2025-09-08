// funcionario.schema.ts
import { z } from 'zod';
import { empresaSchema } from './empresa.schema';
import { pessoaSchema } from './pessoa.schema';

export const TipoUsuarioEnum = z.enum([
  'ADMIN_SISTEMA',
  'ADMINISTRATIVO',
  'MODERADOR',
  'RECRUTADOR',
  'VENDEDOR',
  'CLIENTE_ATS',
  'CLIENTE_CRM',
  'CLIENTE_ATS_CRM',
]);

export type TipoUsuario = z.infer<typeof TipoUsuarioEnum>;

// Schema base
const funcionarioBaseSchema = z.object({
  tipoUsuario: TipoUsuarioEnum,
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  funcionario: z.object({
    setor: z.string().optional(),
    cargo: z.string().optional(),
  }),
  tipoPessoaOuEmpresa: z.enum(['pessoa', 'empresa']),
  pessoa: pessoaSchema.optional(),
  empresa: empresaSchema.optional(),
});

// Schema com validação condicional
export const funcionarioSchema = funcionarioBaseSchema.refine(
  data => {
    if (data.tipoPessoaOuEmpresa === 'pessoa') {
      return data.pessoa !== undefined && data.pessoa !== null;
    }
    if (data.tipoPessoaOuEmpresa === 'empresa') {
      return data.empresa !== undefined && data.empresa !== null;
    }
    return false;
  },
  {
    message: 'Dados de pessoa ou empresa são obrigatórios',
    path: ['tipoPessoaOuEmpresa'],
  }
);

export type FuncionarioInput = z.infer<typeof funcionarioSchema>;
