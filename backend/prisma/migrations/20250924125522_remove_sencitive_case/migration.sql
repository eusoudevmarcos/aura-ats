/*
  Warnings:

  - You are about to drop the column `triagemVagaId` on the `Agenda` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agenda"."Agenda" DROP CONSTRAINT "Agenda_triagemVagaId_fkey";

-- AlterTable
ALTER TABLE "Agenda"."Agenda" DROP COLUMN "triagemVagaId",
ADD COLUMN     "triagemId" TEXT;

-- AddForeignKey
ALTER TABLE "Agenda"."Agenda" ADD CONSTRAINT "Agenda_triagemId_fkey" FOREIGN KEY ("triagemId") REFERENCES "TriagemVaga"."TriagemVaga"("id") ON DELETE SET NULL ON UPDATE CASCADE;
