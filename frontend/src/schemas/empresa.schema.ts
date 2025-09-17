import { z } from 'zod';
import { pessoaSchema } from './pessoa.schema';

// Função para validar datas no formato DD/MM/AAAA
const dataBRString = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve estar no formato DD/MM/AAAA');

// Função para aceitar datas como string (DD/MM/AAAA) ou Date, mas sempre transformar para string
const dataBRTransform = z.union([dataBRString, z.date()]).transform(val => {
  if (typeof val === 'string') return val;
  // Se for Date, converte para DD/MM/AAAA
  const d = val as Date;
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
});

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
  dataAbertura: dataBRTransform,
  representantes: z.array(pessoaSchema).optional(),
  createdAt: z
    .union([dataBRString, z.date()])
    .transform(val => {
      if (typeof val === 'string') return val;
      const d = val as Date;
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const ano = d.getFullYear();
      return `${dia}/${mes}/${ano}`;
    })
    .optional(),
  updatedAt: z
    .union([dataBRString, z.date()])
    .transform(val => {
      if (typeof val === 'string') return val;
      const d = val as Date;
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const ano = d.getFullYear();
      return `${dia}/${mes}/${ano}`;
    })
    .optional(),
});

export type EmpresaInput = z.infer<typeof empresaSchema>;
