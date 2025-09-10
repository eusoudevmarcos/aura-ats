import { isValidCPF } from '@/utils/validateCpf';
import { z } from 'zod';

export const pessoaSchema = z.object({
  id: z.string().nullable(),
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
  // dataNascimento: z
  //   .string()
  //   .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve estar no formato DD/MM/AAAA'),
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
  rg: z.string().optional(),
  // contatos: z.array(contatoSchema).optional(),
  // localizacoes: z.array(localizacaoSchema).optional(),
  // formacoes: z.array(formacaoSchema).optional(),
});

export type PessoaInput = z.infer<typeof pessoaSchema>;
