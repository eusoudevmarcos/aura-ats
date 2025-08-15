/*
  Warnings:

  - You are about to drop the column `dataConclusaoMedicina` on the `Formacao` table. All the data in the column will be lost.
  - You are about to drop the column `dataConclusaoResidencia` on the `Formacao` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."StatusCandidatura" AS ENUM ('APLICADO', 'EM_ANALISE', 'ENTREVISTA_AGENDADA', 'ENTREVISTA_CONCLUIDA', 'OFERTA_ENVIADA', 'OFERTA_ACEITA', 'OFERTA_RECUSADA', 'DESCLASSIFICADO', 'CONTRATADO');

-- AlterTable
ALTER TABLE "public"."Formacao" DROP COLUMN "dataConclusaoMedicina",
DROP COLUMN "dataConclusaoResidencia",
ADD COLUMN     "curso" TEXT DEFAULT 'A definir',
ADD COLUMN     "dataFim" TIMESTAMP(3),
ADD COLUMN     "dataFimResidencia" TIMESTAMP(3),
ADD COLUMN     "dataInicio" TIMESTAMP(3),
ADD COLUMN     "dataInicioResidencia" TIMESTAMP(3),
ADD COLUMN     "instituição" TEXT DEFAULT 'A definir';

-- CreateTable
CREATE TABLE "public"."CandidaturaVaga" (
    "id" TEXT NOT NULL,
    "candidatoId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,
    "status" "public"."StatusCandidatura" NOT NULL DEFAULT 'APLICADO',
    "dataAplicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,

    CONSTRAINT "CandidaturaVaga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CandidaturaVaga_candidatoId_vagaId_key" ON "public"."CandidaturaVaga"("candidatoId", "vagaId");

-- AddForeignKey
ALTER TABLE "public"."CandidaturaVaga" ADD CONSTRAINT "CandidaturaVaga_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "public"."Candidato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidaturaVaga" ADD CONSTRAINT "CandidaturaVaga_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "public"."Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
