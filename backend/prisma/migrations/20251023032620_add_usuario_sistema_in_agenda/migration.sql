/*
  Warnings:

  - Added the required column `usuarioSistemaId` to the `Agenda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agenda"."Agenda" ADD COLUMN     "usuarioSistemaId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Agenda_usuarioSistemaId_idx" ON "Agenda"."Agenda"("usuarioSistemaId");
