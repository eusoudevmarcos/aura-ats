-- CreateEnum
CREATE TYPE "public"."TipoPlano" AS ENUM ('MENSAL', 'POR_USO');

-- AlterTable
ALTER TABLE "Plano"."Plano" ADD COLUMN     "limiteUso" INTEGER,
ADD COLUMN     "tipo" "public"."TipoPlano" NOT NULL DEFAULT 'MENSAL';

-- AlterTable
ALTER TABLE "PlanoAssinatura"."PlanoAssinatura" ADD COLUMN     "usosConsumidos" INTEGER DEFAULT 0,
ADD COLUMN     "usosDisponiveis" INTEGER;

-- CreateTable
CREATE TABLE "PlanoAssinatura"."PlanoUso" (
    "id" TEXT NOT NULL,
    "planoAssinaturaId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dataUso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanoUso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanoUso_planoAssinaturaId_idx" ON "PlanoAssinatura"."PlanoUso"("planoAssinaturaId");
