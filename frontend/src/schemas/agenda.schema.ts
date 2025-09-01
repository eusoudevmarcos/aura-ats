import { localizacaoSchema } from '@/schemas/localizacao.schema';
import { z } from 'zod';

// Enum de tipos de evento
const tipoEventoEnum = z.enum(
  [
    'TRIAGEM_INICIAL',
    'ENTREVISTA_RH',
    'ENTREVISTA_GESTOR',
    'TESTE_TECNICO',
    'TESTE_PSICOLOGICO',
    'DINAMICA_GRUPO',
    'PROPOSTA',
    'OUTRO',
  ],
  { error: 'Tipo de evento é obrigatorio' }
);

// Schema para a etapa do processo seletivo
const etapaAtualSchema = z.object({
  nome: z.string().min(1, 'Nome da etapa é obrigatório'),
  tipo: z.string().min(1, 'Tipo da etapa é obrigatório'),
  ordem: z.number().int().min(1, 'Ordem deve ser um número inteiro positivo'),
  descricao: z.string().optional(),
  ativa: z.boolean(),
});

// Schema principal da Agenda
export const agendaSchema = z
  .object({
    data: z.iso
      .date('Data invalida')
      .max(new Date().getDate())
      .regex(/^\d{2}-\d{2}-\d{4}$/i, 'Data deve ser DD-MM-AAAA'),
    hora: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora deve ser HH:mm (24h)'),
    tipoEvento: tipoEventoEnum,
    link: z.url('Link inválido').optional(),
    localizacao: localizacaoSchema.optional(),
    vagaId: z.uuid().optional(),
    etapaAtual: etapaAtualSchema.optional(),
  })
  .refine(
    data => data.link || data.localizacao,
    'Você deve fornecer link ou localização'
  )
  .refine(
    data => !(data.link && data.localizacao),
    'Você não deve fornecer link e localização ao mesmo tempo'
  );
// Tipo TypeScript baseado no schema
export type AgendaInput = z.infer<typeof agendaSchema>;
