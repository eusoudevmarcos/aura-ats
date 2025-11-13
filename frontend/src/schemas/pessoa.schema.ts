import { isValidCPF } from '@/utils/validateCpf';
import { z } from 'zod';
import { localizacaoSchema } from './localizacao.schema';

export const pessoaSchema = z.object({
  id: z.string().nullable().optional(),
  nome: z.string('Nome é obrigatória').min(1, 'Nome é obrigatório'),
  cpf: z
    .string()
    .refine(
      val => {
        if (val.length > 0) {
          const unmaskedCpf = val.replace(/\D/g, '');
          return isValidCPF(unmaskedCpf);
        }
        return true;
      },
      {
        message: 'CPF inválido',
      }
    )
    .optional()
    .nullable(),
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
    .optional()
    .nullable(),
  dataNascimento: z
    .union([
      z.string().refine(
        val => {
          if (val.length > 0) {
            return /^\d{2}\/\d{2}\/\d{4}$/.test(val);
          }
          return true;
        },
        { message: 'Data deve estar no formato DD/MM/AAAA' }
      ),
      z.date(),
    ])
    .optional()
    .nullable(),

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
