/*
  Warnings:

  - You are about to drop the column `triagemId` on the `Agenda` table. All the data in the column will be lost.
  - You are about to drop the column `empresaId` on the `UsuarioSistema` table. All the data in the column will be lost.
  - You are about to drop the column `pessoaId` on the `UsuarioSistema` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioSistemaId]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pessoaId]` on the table `Funcionario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuarioSistemaId` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "ProcessoSeletivoEtapa";

-- DropForeignKey
ALTER TABLE "Agenda"."Agenda" DROP CONSTRAINT "Agenda_triagemId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioSistema"."UsuarioSistema" DROP CONSTRAINT "UsuarioSistema_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioSistema"."UsuarioSistema" DROP CONSTRAINT "UsuarioSistema_pessoaId_fkey";

-- DropIndex
DROP INDEX "Agenda"."Agenda_clienteId_idx";

-- DropIndex
DROP INDEX "Agenda"."Agenda_localizacaoId_idx";

-- DropIndex
DROP INDEX "Agenda"."Agenda_triagemId_idx";

-- DropIndex
DROP INDEX "UsuarioSistema"."UsuarioSistema_empresaId_key";

-- DropIndex
DROP INDEX "UsuarioSistema"."UsuarioSistema_pessoaId_key";

-- AlterTable
ALTER TABLE "Agenda"."Agenda" DROP COLUMN "triagemId",
ADD COLUMN     "etapaAtualId" TEXT,
ADD COLUMN     "triagemVagaId" TEXT,
ADD COLUMN     "vagaId" TEXT;

-- AlterTable
ALTER TABLE "CandidaturaVaga"."CandidaturaVaga" ADD COLUMN     "processoSeletivoEtapaId" TEXT;

-- AlterTable
ALTER TABLE "Cliente"."Cliente" ADD COLUMN     "usuarioSistemaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Funcionario"."Funcionario" ADD COLUMN     "pessoaId" TEXT;

-- AlterTable
ALTER TABLE "UsuarioSistema"."UsuarioSistema" DROP COLUMN "empresaId",
DROP COLUMN "pessoaId";

-- CreateTable
CREATE TABLE "ProcessoSeletivoEtapa"."ProcessoSeletivoEtapa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoEtapa"."TipoEtapa" NOT NULL,
    "ordem" INTEGER NOT NULL,
    "descricao" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProcessoSeletivoEtapa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_usuarioSistemaId_key" ON "Cliente"."Cliente"("usuarioSistemaId");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_pessoaId_key" ON "Funcionario"."Funcionario"("pessoaId");

-- CreateIndex
CREATE INDEX "Funcionario_pessoaId_idx" ON "Funcionario"."Funcionario"("pessoaId");

-- CreateIndex
CREATE INDEX "Funcionario_usuarioSistemaId_idx" ON "Funcionario"."Funcionario"("usuarioSistemaId");

-- CreateIndex
CREATE INDEX "Pessoa_empresaRepresentadaId_idx" ON "Pessoa"."Pessoa"("empresaRepresentadaId");

-- CreateIndex
CREATE INDEX "TriagemVaga_vagaId_idx" ON "TriagemVaga"."TriagemVaga"("vagaId");

-- AddForeignKey
ALTER TABLE "Agenda"."Agenda" ADD CONSTRAINT "Agenda_etapaAtualId_fkey" FOREIGN KEY ("etapaAtualId") REFERENCES "ProcessoSeletivoEtapa"."ProcessoSeletivoEtapa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda"."Agenda" ADD CONSTRAINT "Agenda_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"."Vaga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda"."Agenda" ADD CONSTRAINT "Agenda_triagemVagaId_fkey" FOREIGN KEY ("triagemVagaId") REFERENCES "TriagemVaga"."TriagemVaga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente"."Cliente" ADD CONSTRAINT "Cliente_usuarioSistemaId_fkey" FOREIGN KEY ("usuarioSistemaId") REFERENCES "UsuarioSistema"."UsuarioSistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funcionario"."Funcionario" ADD CONSTRAINT "Funcionario_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidaturaVaga"."CandidaturaVaga" ADD CONSTRAINT "CandidaturaVaga_processoSeletivoEtapaId_fkey" FOREIGN KEY ("processoSeletivoEtapaId") REFERENCES "ProcessoSeletivoEtapa"."ProcessoSeletivoEtapa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
