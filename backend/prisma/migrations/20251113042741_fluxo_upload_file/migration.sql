-- CreateTable
CREATE TABLE "Candidato"."CandidatoAnexo" (
    "candidatoId" TEXT NOT NULL,
    "anexoId" TEXT NOT NULL,

    CONSTRAINT "CandidatoAnexo_pkey" PRIMARY KEY ("candidatoId","anexoId")
);

-- CreateIndex
CREATE INDEX "CandidatoAnexo_anexoId_idx" ON "Candidato"."CandidatoAnexo"("anexoId");
