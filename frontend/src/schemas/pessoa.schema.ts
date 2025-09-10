import { brazilianDateSchema } from '@/utils/date/DateSchemas';
import { isValidCPF } from '@/utils/validateCpf';
import { z } from 'zod';
import { contatoSchema } from './contato.schema';
import { formacaoSchema } from './formacao.schame';
import { localizacaoSchema } from './localizacao.schema';

export const pessoaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .refine(
      val => {
        const unmaskedCpf = val.replace(/\D/g, '');
        return isValidCPF(unmaskedCpf);
      },
      {
        message: 'CPF inválido',
      }
    ),
  dataNascimento: brazilianDateSchema,
  estadoCivil: z
    .enum([
      'SOLTEIRO',
      'CASADO',
      'DIVORCIADO',
      'VIUVO',
      'SEPARADO',
      'UNIAO_ESTAVEL',
    ])
    .optional(),
  rg: z.string().optional(),
  contatos: z.array(contatoSchema).optional(),
  localizacoes: z.array(localizacaoSchema).optional(),
  formacoes: z.array(formacaoSchema).optional(),
});

export type PessoaInput = z.infer<typeof pessoaSchema>;
