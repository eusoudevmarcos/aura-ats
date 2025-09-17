// src/schemas/vaga.schema.ts
import { z } from 'zod';
import { clienteSchema } from './cliente.schema';

export const CategoriaVagaEnum = z.enum(
  [
    'TECNOLOGIA',
    'SAUDE',
    'ADMINISTRATIVO',
    'FINANCEIRO',
    'RECURSOS_HUMANOS',
    'MARKETING',
    'VENDAS',
    'OUTROS',
  ],
  'Categoria da vaga é obrigatório'
);
export type CategoriaVagaEnum = z.infer<typeof CategoriaVagaEnum>;

export const StatusVagaEnum = z.enum(
  ['ATIVA', 'PAUSADA', 'ENCERRADA', 'ARQUIVADA'],
  'Status da vaga é obrigatório'
);

export type StatusVagaEnum = z.infer<typeof StatusVagaEnum>;

export const TipoContratoEnum = z.enum(
  ['CLT', 'PJ', 'ESTAGIO', 'FREELANCER', 'TEMPORARIO'],
  'Tipo de contrato é obrigatório'
);
export type TipoContratoEnum = z.infer<typeof TipoContratoEnum>;

export const NivelExperienciaEnum = z.enum(
  ['ESTAGIO', 'JUNIOR', 'PLENO', 'SENIOR', 'ESPECIALISTA', 'GERENTE'],
  'Nível de experiencia é obrigatório'
);
export type NivelExperienciaEnum = z.infer<typeof NivelExperienciaEnum>;

export const TipoHabilidadeEnum = z.enum([
  'TECNICA',
  'COMPORTAMENTAL',
  'IDIOMA',
  'OUTRA',
]);
export type TipoHabilidadeEnum = z.infer<typeof TipoHabilidadeEnum>;

export const NivelExigidoEnum = z.enum([
  'BASICO',
  'INTERMEDIARIO',
  'AVANCADO',
  'FLUENTE',
  'NATIVO',
]);
export type NivelExigidoEnum = z.infer<typeof NivelExigidoEnum>;

// SCHEMA PARA UMA ÚNICA HABILIDADE
export const habilidadeSchema = z.object({
  nome: z.string().min(1, 'O nome da habilidade é obrigatório.'),
  tipoHabilidade: TipoHabilidadeEnum,
  nivelExigido: NivelExigidoEnum,
});
export type HabilidadeInput = z.infer<typeof habilidadeSchema>;

// SCHEMA PARA UM ÚNICO BENEFÍCIO
export const beneficioSchema = z.object({
  nome: z.string().min(1, 'O nome do benefício é obrigatório.'),
  descricao: z.string(),
});
export type BeneficioInput = z.infer<typeof beneficioSchema>;

export const vagaSchema = z.object({
  id: z.uuid().optional(),
  cliente: clienteSchema.nullable().nullish().optional(),
  clienteId: z.uuid('Um cliente é obrigatória'),
  titulo: z.string().min(3, 'O título da vaga é obrigatório.'),
  descricao: z
    .string()
    .min(20, 'A descrição da vaga deve ter no mínimo 20 caracteres.'),
  // requisitos: z.string().optional(),
  // responsabilidades: z.string().optional(),
  categoria: CategoriaVagaEnum.optional(),
  status: StatusVagaEnum.default('ATIVA').optional(),
  tipoContrato: TipoContratoEnum.optional(),
  nivelExperiencia: NivelExperienciaEnum.optional(),

  // localizacao: localizacaoSchema,

  // habilidades: z.array(habilidadeSchema),
  // beneficios: z.array(beneficioSchema),

  tipoSalario: z.string().optional(),
  salario: z
    .string()
    .trim()
    .transform(val => val.replace(',', '.'))
    .pipe(z.coerce.number())
    .pipe(z.number().positive('O salário deve ser um valor positivo.'))
    .nullable()
    .optional(),
});

export type VagaInput = z.infer<typeof vagaSchema>;
