import { UF_MODEL } from '@/utils/UF';
import z from 'zod';

export const localizacaoSchema = z.object({
  id: z.string().nullable().optional(),
  cep: z.string().length(9, 'CEP deve ter 9 caracteres').optional(),
  cidade: z.string().min(1, 'Cidade é obrigatória').optional(),
  bairro: z.string(),
  uf: z
    .string('UF é obrogatoria')
    .min(2, 'Minimo 2 caracteres')
    .transform(s => s.toUpperCase())
    .refine(val => UF_MODEL.some(({ value }) => value === val), {
      message: 'UF inválida',
    })
    .optional(),
  // estado: z
  //   .string('Estado é obrigatório')
  //   .min(2, 'No minimo 2 caracateres')
  //   .transform(s => s.toUpperCase())
  //   .refine(val => UF_MODEL.some(({ value }) => value === val), {
  //     message: 'Estado inválida',
  //   })
  //   .optional(),
  regiao: z
    .string()
    .length(2, 'Região deve ter pelo menos 2 caracteres')
    .transform(s => s.toUpperCase())
    .optional(),
  complemento: z.string().optional(),
  logradouro: z.string().optional(),
});
export type LocalizacaoInput = z.infer<typeof localizacaoSchema>;
