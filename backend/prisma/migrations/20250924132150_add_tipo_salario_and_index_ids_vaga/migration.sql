-- AlterTable
ALTER TABLE "Vaga"."Vaga" ADD COLUMN     "tipoSalario" TEXT;

-- CreateIndex
CREATE INDEX "Vaga_localizacaoId_idx" ON "Vaga"."Vaga"("localizacaoId");

-- CreateIndex
CREATE INDEX "Vaga_clienteId_idx" ON "Vaga"."Vaga"("clienteId");
