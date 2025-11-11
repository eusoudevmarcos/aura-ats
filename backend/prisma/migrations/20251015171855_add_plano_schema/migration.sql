-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Plano";

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