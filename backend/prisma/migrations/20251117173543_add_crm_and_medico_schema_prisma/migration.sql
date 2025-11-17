/*
  Warnings:

  - You are about to drop the column `crm` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `rqe` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `sexo` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `signo` on the `Candidato` table. All the data in the column will be lost.
  - You are about to drop the column `dataInscricaoCrm` on the `Medico` table. All the data in the column will be lost.
  - You are about to drop the column `ufCrm` on the `Medico` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidato"."Candidato" DROP COLUMN "crm",
DROP COLUMN "rqe",
DROP COLUMN "sexo",
DROP COLUMN "signo";

-- AlterTable
ALTER TABLE "Candidato"."Medico" DROP COLUMN "dataInscricaoCrm",
DROP COLUMN "ufCrm",
ADD COLUMN     "rqe" TEXT;

-- AlterTable
ALTER TABLE "Pessoa"."Pessoa" ADD COLUMN     "sexo" "public"."Sexo",
ADD COLUMN     "signo" "public"."Signo";

-- CreateTable
CREATE TABLE "Candidato"."Crm" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "ufCrm" TEXT NOT NULL,
    "dataInscricao" TIMESTAMP(3) NOT NULL,
    "medicoId" TEXT,

    CONSTRAINT "Crm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Crm_medicoId_idx" ON "Candidato"."Crm"("medicoId");
