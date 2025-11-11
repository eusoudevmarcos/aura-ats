import { isValidCPF } from '@/utils/validateCpf';
import { z } from 'zod';
import { localizacaoSchema } from './localizacao.schema';

export const pessoaSchema = z.object({
  id: z.string().nullable().optional(),
  nome: z.string('Nome é obrigatória').min(1, 'Nome é obrigatório'),
  cpf: z
    .string('CPF é obrigatório')
    .min(1, 'CPF é obrigatório')
    .refine(
      val => {
        const unmaskedCpf = val.replace(/\D/g, '');
        return isValidCPF(unmaskedCpf);
      },
      {
        message: 'CPF inválido',
      }
    )
    .optional(),
  rg: z
    .string()
    .refine(
      val => {
        if (val) {
          const unmaskedCpf = val.replace(/\D/g, '');
          return unmaskedCpf;
        }
      },
      {
        message: 'RG inválido',
      }
    )
    .optional(),
  dataNascimento: z
    .union([
      z
        .string()
        .regex(
          /^\d{2}\/\d{2}\/\d{4}$/,
          'Data deve estar no formato DD/MM/AAAA'
        ),
      z.date(),
    ])
    .optional(),

  // estadoCivil: z
  //   .enum([
  //     'SOLTEIRO',
  //     'CASADO',
  //     'DIVORCIADO',
  //     'VIUVO',
  //     'SEPARADO',
  //     'UNIAO_ESTAVEL',
  //   ])
  //   .optional(),
  // contatos: z.array(contatoSchema).optional(),
  localizacoes: z.array(localizacaoSchema).optional(),
  // formacoes: z.array(formacaoSchema).optional(),
});

export type PessoaInput = z.infer<typeof pessoaSchema>;
