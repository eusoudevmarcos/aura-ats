/*
  Warnings:

  - You are about to drop the column `celular` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Candidato` table. All the data in the column will be lost.
  - The `crm` column on the `Candidato` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `candidatoId` on the `Contato` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Contato"."Contato_candidatoId_idx";

-- AlterTable
ALTER TABLE "Candidato"."Candidato" DROP COLUMN "celular",
DROP COLUMN "email",
ADD COLUMN     "contatos" TEXT[],
ADD COLUMN     "emails" TEXT[],
DROP COLUMN "crm",
ADD COLUMN     "crm" TEXT[];

-- AlterTable
ALTER TABLE "Contato"."Contato" DROP COLUMN "candidatoId";
