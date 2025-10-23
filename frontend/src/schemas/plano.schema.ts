// plano.schema.ts
import { z } from 'zod';

export const planoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  descricao: z.string().optional(),
  preco: z.number(),
  tipo: z.enum(['MENSAL', 'ANUAL', 'POR_USO']),
  diasGarantia: z.number().optional(),
  limiteUso: z.number().optional(),
  ativo: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Plano = z.infer<typeof planoSchema>;

export const planoAssinaturaSchema = z.object({
  id: z.string(),
  clienteId: z.string(),
  planoId: z.string(),
  dataAssinatura: z.string(),
  dataExpiracao: z.string().optional(),
  status: z.enum(['ATIVA', 'INATIVA', 'EXPIRADA', 'CANCELADA']),
  valorPago: z.number(),
  detalhes: z.string().optional(),
  usosDisponiveis: z.number().optional(),
  usosConsumidos: z.number().optional(),
  plano: planoSchema,
});

export type PlanoAssinatura = z.infer<typeof planoAssinaturaSchema>;
