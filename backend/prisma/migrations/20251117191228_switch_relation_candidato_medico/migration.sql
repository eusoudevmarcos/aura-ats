/*
  Warnings:

  - You are about to drop the column `medicoId` on the `Candidato` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[candidatoId]` on the table `Medico` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Candidato"."Candidato_medicoId_key";

-- AlterTable
ALTER TABLE "Candidato"."Candidato" DROP COLUMN "medicoId";

-- AlterTable
ALTER TABLE "Candidato"."Medico" ADD COLUMN     "candidatoId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Medico_candidatoId_key" ON "Candidato"."Medico"("candidatoId");

-- CreateIndex
CREATE INDEX "Medico_candidatoId_idx" ON "Candidato"."Medico"("candidatoId");
