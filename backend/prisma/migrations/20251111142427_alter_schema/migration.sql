/*
  Warnings:

  - You are about to drop the `PlanoAssinado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlanoUso` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "PlanoAssinado";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "PlanoUso";

-- DropTable
DROP TABLE "Plano"."PlanoAssinado";

-- DropTable
DROP TABLE "Plano"."PlanoUso";

-- CreateTable
CREATE TABLE "PlanoAssinado"."PlanoAssinado" (
    "id" TEXT NOT NULL,
    "status" "public"."AssinaturaStatus" NOT NULL DEFAULT 'ATIVA',
    "dataAssinatura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataExpiracao" TIMESTAMP(3),
    "qtdVagas" INTEGER,
    "precoPersonalizado" DECIMAL(10,2),
    "porcentagemMinima" DECIMAL(10,2),
    "observacoes" TEXT,
    "usosDisponiveis" INTEGER,
    "usosConsumidos" INTEGER,
    "clienteId" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,

    CONSTRAINT "PlanoAssinado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanoUso"."PlanoUso" (
    "id" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dataUso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planoAssinaturaId" TEXT NOT NULL,

    CONSTRAINT "PlanoUso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanoAssinado_clienteId_idx" ON "PlanoAssinado"."PlanoAssinado"("clienteId");

-- CreateIndex
CREATE INDEX "PlanoAssinado_planoId_idx" ON "PlanoAssinado"."PlanoAssinado"("planoId");

-- CreateIndex
CREATE INDEX "PlanoUso_planoAssinaturaId_idx" ON "PlanoUso"."PlanoUso"("planoAssinaturaId");
