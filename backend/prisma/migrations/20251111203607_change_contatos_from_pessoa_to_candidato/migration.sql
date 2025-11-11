/*
  Warnings:

  - You are about to drop the column `empresaId` on the `Contato` table. All the data in the column will be lost.
  - You are about to drop the column `pessoaId` on the `Contato` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Contato"."Contato_empresaId_idx";

-- DropIndex
DROP INDEX "Contato"."Contato_pessoaId_idx";

-- AlterTable
ALTER TABLE "Contato"."Contato" DROP COLUMN "empresaId",
DROP COLUMN "pessoaId",
ADD COLUMN     "candidatoId" TEXT;

-- CreateIndex
CREATE INDEX "Contato_candidatoId_idx" ON "Contato"."Contato"("candidatoId");
