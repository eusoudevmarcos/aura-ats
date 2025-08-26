import { PrismaClient } from "@prisma/client";

type Primitive = string | number | boolean | Date;

export type NestedInput =
  | Primitive
  | Primitive[]
  | { [key: string]: NestedInput };

// Configuração para validação de dados existentes
export interface ValidationConfig {
  uniqueKeys?: string[]; // campos únicos para buscar registro existente
  searchFields?: Record<string, any>; // campos específicos para busca
  model?: string; // modelo específico para busca (se diferente do campo)
}

// Configuração para relações
export interface RelationConfig {
  type: "one-to-one" | "one-to-many" | "many-to-many";
  validation?: ValidationConfig;
  include?: Record<string, any>; // include para a relação
  connectOnly?: boolean; // se deve apenas conectar (não criar)
}

// Configuração geral para o builder
export interface BuildSaveOptions<T> {
  prisma: PrismaClient;
  tx: any; // Usando any para aceitar tanto PrismaClient quanto transaction client
  model: keyof PrismaClient;
  data: T;
  idField?: string; // campo id do registro principal
  relations?: Record<string, RelationConfig>; // configuração das relações
  include?: Record<string, any>; // include padrão para o retorno
  skipValidation?: boolean; // pular validação de dados existentes
}

// Tipo para o resultado do build
export interface BuildResult {
  data: Record<string, any>;
  includes?: Record<string, any>;
}

// Tipo para configuração de save
export interface SaveOptions<T> extends BuildSaveOptions<T> {
  returnIncludes?: boolean; // se deve retornar com includes
}
