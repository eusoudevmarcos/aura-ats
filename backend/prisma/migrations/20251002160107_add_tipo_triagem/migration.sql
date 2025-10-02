-- CreateEnum
CREATE TYPE "public"."TipoEventoTriagem" AS ENUM ('TRIAGEM_INICIAL', 'ENTREVISTA_RH', 'ENTREVISTA_GESTOR', 'TESTE_TECNICO', 'TESTE_PSICOLOGICO', 'DINAMICA_GRUPO', 'PROPOSTA', 'OUTRO');

-- AlterTable
ALTER TABLE "TriagemVaga"."TriagemVaga" ADD COLUMN     "tipoTriagem" "public"."TipoEventoTriagem" NOT NULL DEFAULT 'TRIAGEM_INICIAL';
