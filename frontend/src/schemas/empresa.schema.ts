import { z } from 'zod';
import { pessoaSchema } from './pessoa.schema';

export const empresaSchema = z.object({
  id: z.string().uuid().optional(),
  razaoSocial: z.string().min(1, 'Razão Social é obrigatória'),
  nomeFantasia: z.string().min(1, 'Nome Fantasia é obrigatória'),
  cnpj: z
    .string()
    .min(14, 'CNPJ inválido')
    .regex(
      /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/,
      'Formato de CNPJ inválido'
    ),
  dataAbertura: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve estar no formato DD/MM/AAAA'),
  representantes: z.array(pessoaSchema).optional(),
  createdAt: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve estar no formato DD/MM/AAAA')
    .optional(),
  updatedAt: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve estar no formato DD/MM/AAAA')
    .optional(),
});

export type EmpresaInput = z.infer<typeof empresaSchema>;
