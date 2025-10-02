import {
  AreaCandidato,
  CategoriaVaga,
  NivelExperiencia,
  Prisma,
  StatusVaga,
  TipoContrato,
} from "@prisma/client";

// --- ENUMS (já estão corretos) ---
export { CategoriaVaga, NivelExperiencia, StatusVaga, TipoContrato };

// ===================== INTERFACES DE ENTRADA (INPUT DTOs) =====================
// Interfaces para dados que vêm do frontend ou são usados para criar/atualizar

// Benefício de entrada (sem o ID do benefício, já que o Prisma irá gerá-lo na criação)
export interface BeneficioInput {
  id?: string; // Opcional para updates
  nome: string;
  descricao?: string;
  // vagaId e vaga não são necessários na entrada aninhada
}

// VagaHabilidade de entrada (requer id da Habilidade e nível)
export interface VagaHabilidadeInput {
  nome: string;
  tipoHabilidade: string;
  nivelExigido: string;
}

// VagaAnexo de entrada (requer id do Anexo)
export interface VagaAnexoInput {
  anexoId: string;
}

// Localizacao de entrada (se for para criar/atualizar diretamente aninhado)
// Note que Prisma.LocalizacaoCreateInput e Prisma.LocalizacaoUpdateInput são as melhores
// fontes de verdade para o que o Prisma espera.
export type LocalizacaoInput = Omit<
  Prisma.LocalizacaoCreateInput,
  "pessoa" | "empresa" | "agendaVaga"
> & { id?: string };

// Interface principal para a entrada da Vaga (para CREATE ou UPDATE)
// Usamos Prisma.VagaCreateInput para o base e ajustamos para o UPDATE
// para garantir compatibilidade com o que o Prisma realmente espera.
export interface VagaSaveInput {
  id?: string; // Opcional, indica se é uma atualização ou criação
  titulo: string;
  descricao: string;
  requisitos?: string;
  responsabilidades?: string;
  salario?: number; // Ajustado para 'salario' conforme seu schema
  tipoSalario?: string; // Novo campo
  dataPublicacao?: Date; // Opcional na criação se @default(now())
  dataFechamento?: Date;
  // create_at e update_at são gerenciados pelo Prisma

  categoria: CategoriaVaga;
  status: StatusVaga;
  tipoContrato: TipoContrato;
  nivelExperiencia: NivelExperiencia;
  areaCandidato?: AreaCandidato;

  // Relações que serão manipuladas aninhadamente:
  // Note que aqui passamos os dados 'brutos' para criar/conectar
  beneficios?: BeneficioInput[]; // Para criar/atualizar Benefícios relacionados
  habilidades?: VagaHabilidadeInput[]; // Para criar/atualizar VagaHabilidade
  anexos?: VagaAnexoInput[]; // Para criar/atualizar VagaAnexo

  // Cliente
  clienteId: string; // Cliente é obrigatório

  // Localização
  localizacao?: LocalizacaoInput; // Se você quiser criar/atualizar a localização junto
  localizacaoId?: string; // Para conectar uma localização existente

  // Triagens da vaga (nested)
  triagens?: { id?: string; tipoTriagem: string; ativa?: boolean }[];
}

// ===================== INTERFACES DE SAÍDA (Output DTOs - Se precisar de uma representação específica) =====================
// A interface Vaga que você já tinha é uma boa representação do modelo final do Prisma.
// Você pode usar 'Prisma.VagaGetPayload' para inferir o tipo do resultado da query do Prisma,
// o que é mais robusto.
export type VagaOutput = Prisma.VagaGetPayload<{
  include: {
    cliente: true;
    localizacao: true;
    beneficios: true;
    habilidades: { include: { habilidade: true } };
    anexos: { include: { anexo: true } };
    // Inclua outras relações que você SEMPRE quer retornar
  };
}>;

// Exemplo de como importar e usar
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
