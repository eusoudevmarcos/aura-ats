-- CreateEnum
CREATE TYPE "public"."CategoriaPlano" AS ENUM ('PLATAFORMA', 'RECRUTAMENTO_COM_RQE', 'RECRUTAMENTO_SEM_RQE', 'RECRUTAMENTO_DIVERSOSO');

-- AlterTable
ALTER TABLE "Plano"."Plano" ADD COLUMN     "categoria" "public"."CategoriaPlano";
