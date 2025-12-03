/*
  Warnings:

  - The values [ATIVA] on the enum `StatusVaga` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `especialidadeId` on the `Candidato` table. All the data in the column will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "EspecialidadeMedico";

-- AlterEnum
BEGIN;
CREATE TYPE "public"."StatusVaga_new" AS ENUM ('ALINHAMENTO', 'ABERTA', 'DIVULGACAO', 'TRIAGEM_DE_CURRICULO', 'CONCUIDA', 'GARANTIA', 'PAUSADA', 'ENCERRADA', 'ARQUIVADA');
ALTER TABLE "Vaga"."Vaga" ALTER COLUMN "status" TYPE "public"."StatusVaga_new" USING ("status"::text::"public"."StatusVaga_new");
ALTER TYPE "public"."StatusVaga" RENAME TO "StatusVaga_old";
ALTER TYPE "public"."StatusVaga_new" RENAME TO "StatusVaga";
DROP TYPE "public"."StatusVaga_old";
COMMIT;

-- DropIndex
DROP INDEX "Candidato"."Candidato_especialidadeId_idx";

-- AlterTable
ALTER TABLE "Candidato"."Candidato" DROP COLUMN "especialidadeId";

-- CreateTable
CREATE TABLE "EspecialidadeMedico"."EspecialidadeMedico" (
    "id" TEXT NOT NULL,
    "rqe" TEXT NOT NULL,
    "especialidadeId" INTEGER NOT NULL,
    "medicoId" TEXT NOT NULL,

    CONSTRAINT "EspecialidadeMedico_pkey" PRIMARY KEY ("especialidadeId","medicoId")
);

-- CreateIndex
CREATE INDEX "EspecialidadeMedico_especialidadeId_idx" ON "EspecialidadeMedico"."EspecialidadeMedico"("especialidadeId");

-- CreateIndex
CREATE INDEX "EspecialidadeMedico_medicoId_idx" ON "EspecialidadeMedico"."EspecialidadeMedico"("medicoId");
