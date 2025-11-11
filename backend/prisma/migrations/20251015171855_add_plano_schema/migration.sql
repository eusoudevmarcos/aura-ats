-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Plano";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "PlanoAssinatura";

-- CreateEnum
CREATE TYPE "public"."AssinaturaStatus" AS ENUM ('ATIVA', 'EXPIRADA', 'CANCELADA', 'PENDENTE');

-- CreateTable
CREATE TABLE "Plano"."Plano" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "diasGarantia" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanoAssinatura"."PlanoAssinatura" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "dataAssinatura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataExpiracao" TIMESTAMP(3),
    "status" "public"."AssinaturaStatus" NOT NULL DEFAULT 'ATIVA',
    "valorPago" DECIMAL(10,2) NOT NULL,
    "detalhes" TEXT,
    "planoId" TEXT NOT NULL,

    CONSTRAINT "PlanoAssinatura_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PlanoAssinatura_usuarioId_idx" ON "PlanoAssinatura"."PlanoAssinatura"("usuarioId");
CREATE UNIQUE INDEX IF NOT EXISTS "PlanoAssinatura_planoId_idx" ON "PlanoAssinatura"."PlanoAssinatura"("planoId");