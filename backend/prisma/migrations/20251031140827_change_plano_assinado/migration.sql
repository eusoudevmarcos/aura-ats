-- CreateTable
CREATE TABLE "Plano"."PlanoAssinado" (
    "id" TEXT NOT NULL,
    "status" "public"."AssinaturaStatus" NOT NULL DEFAULT 'ATIVA',
    "dataAssinatura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataExpiracao" TIMESTAMP(3),
    "qtdVagas" INTEGER,
    "precoPersonalizado" DECIMAL(10,2),
    "porcentagemMinima" DECIMAL(10,2),
    "observações" TEXT,
    "usosDisponiveis" INTEGER,
    "usosConsumidos" INTEGER,
    "clienteId" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,

    CONSTRAINT "PlanoAssinado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano"."PlanoUso" (
    "id" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dataUso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planoAssinaturaId" TEXT NOT NULL,

    CONSTRAINT "PlanoUso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanoAssinado_clienteId_idx" ON "Plano"."PlanoAssinado"("clienteId");

-- CreateIndex
CREATE INDEX "PlanoAssinado_planoId_idx" ON "Plano"."PlanoAssinado"("planoId");

-- CreateIndex
CREATE INDEX "PlanoUso_planoAssinaturaId_idx" ON "Plano"."PlanoUso"("planoAssinaturaId");
