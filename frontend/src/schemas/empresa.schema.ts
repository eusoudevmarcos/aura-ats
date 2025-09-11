import { z } from 'zod';
import { pessoaSchema } from './pessoa.schema';

export const empresaSchema = z.object({
  id: z.string().nullable().optional(),
  razaoSocial: z.string().min(1, 'Razão Social é obrigatória'),
  nomeFantasia: z.string().min(1, 'Nome Fantasia é obrigatória'),
  cnpj: z
    .string()
    .min(18, 'CNPJ inválido') // inclui pontos, barra e traço
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'Formato de CNPJ inválido'),

  dataAbertura: z.union([
    z
      .string()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve estar no formato DD/MM/AAAA'),
    z.date(),
  ]),
  // contatos: z.array(contatoSchema),
  // localizacoes: z.array(localizacaoSchema),
  representantes: z.array(pessoaSchema),
});

export type EmpresaInput = z.infer<typeof empresaSchema>;
