/*
  Warnings:

  - The `status` column on the `CandidaturaVaga` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tipoServico` column on the `Cliente` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estadoCivil` column on the `Pessoa` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tipoContrato` column on the `Vaga` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `nivelExperiencia` column on the `Vaga` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `areaCandidato` column on the `Vaga` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `moeda` column on the `Vaga` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `periodicidade` column on the `Vaga` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[pessoaId]` on the table `Socio` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId]` on the table `Socio` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `tipoEvento` on the `Agenda` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `areaCandidato` on the `Candidato` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Cliente` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tipo` on the `ProcessoSeletivoEtapa` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tipoSocio` on the `Socio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tipoUsuario` on the `UsuarioSistema` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoria` on the `Vaga` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Vaga` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."CategoriaVaga" AS ENUM ('TECNOLOGIA', 'SAUDE', 'ADMINISTRATIVO', 'FINANCEIRO', 'RECURSOS_HUMANOS', 'MARKETING', 'VENDAS', 'OUTROS');

-- CreateEnum
CREATE TYPE "public"."StatusVaga" AS ENUM ('ATIVA', 'PAUSADA', 'ENCERRADA', 'ARQUIVADA');

-- CreateEnum
CREATE TYPE "public"."TipoContrato" AS ENUM ('CLT', 'PJ', 'ESTAGIO', 'FREELANCER', 'TEMPORARIO');

-- CreateEnum
CREATE TYPE "public"."NivelExperiencia" AS ENUM ('ESTAGIO', 'JUNIOR', 'PLENO', 'SENIOR', 'ESPECIALISTA', 'GERENTE');

-- CreateEnum
CREATE TYPE "public"."TipoEtapa" AS ENUM ('APLICACAO', 'TRIAGEM', 'TESTE', 'ENTREVISTA', 'OFERTA', 'CONTRATACAO');

-- CreateEnum
CREATE TYPE "public"."StatusCandidatura" AS ENUM ('APLICADO', 'EM_ANALISE', 'ENTREVISTA_AGENDADA', 'ENTREVISTA_CONCLUIDA', 'OFERTA_ENVIADA', 'OFERTA_ACEITA', 'OFERTA_RECUSADA', 'DESCLASSIFICADO', 'CONTRATADO');

-- CreateEnum
CREATE TYPE "public"."TipoServico" AS ENUM ('RECRUTAMENTO_CONTRATUAL', 'RECRUTAMENTO_DISPARO_CURRICULO', 'RECRUTAMENTO_INFORMACAO', 'PLATAFORMA');

-- CreateEnum
CREATE TYPE "public"."AreaCandidato" AS ENUM ('MEDICINA', 'ENFERMAGEM', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."StatusCliente" AS ENUM ('PROSPECT', 'LEAD', 'ATIVO', 'INATIVO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "public"."TipoEventoAgenda" AS ENUM ('TRIAGEM_INICIAL', 'ENTREVISTA_RH', 'ENTREVISTA_GESTOR', 'TESTE_TECNICO', 'TESTE_PSICOLOGICO', 'DINAMICA_GRUPO', 'PROPOSTA', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."Moeda" AS ENUM ('BRL', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "public"."PeriodicidadeSalario" AS ENUM ('HORA', 'DIA', 'MES', 'ANO');

-- CreateEnum
CREATE TYPE "public"."TipoSocio" AS ENUM ('REPRESENTANTE', 'SOCIO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "public"."EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'SEPARADO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('ADMIN_SISTEMA', 'ADMINISTRATIVO', 'MODERADOR', 'RECRUTADOR', 'VENDEDOR', 'CLIENTE_ATS', 'CLIENTE_ATS_CRM', 'CLIENTE_CRM');

-- CreateEnum
CREATE TYPE "public"."TipoPessoa" AS ENUM ('FISICA', 'JURIDICA');

-- DropForeignKey
ALTER TABLE "Agenda"."Agenda" DROP CONSTRAINT "Agenda_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Agenda"."Agenda" DROP CONSTRAINT "Agenda_etapaAtualId_fkey";

-- DropForeignKey
ALTER TABLE "Agenda"."Agenda" DROP CONSTRAINT "Agenda_localizacaoId_fkey";

-- DropForeignKey
ALTER TABLE "Agenda"."Agenda" DROP CONSTRAINT "Agenda_triagemId_fkey";

-- DropForeignKey
ALTER TABLE "Agenda"."Agenda" DROP CONSTRAINT "Agenda_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "AgendaCandidatura"."AgendaCandidatura" DROP CONSTRAINT "AgendaCandidatura_agendaId_fkey";

-- DropForeignKey
ALTER TABLE "AgendaCandidatura"."AgendaCandidatura" DROP CONSTRAINT "AgendaCandidatura_candidaturaId_fkey";

-- DropForeignKey
ALTER TABLE "Candidato"."Candidato" DROP CONSTRAINT "Candidato_especialidadeId_fkey";

-- DropForeignKey
ALTER TABLE "Candidato"."Candidato" DROP CONSTRAINT "Candidato_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "CandidaturaVaga"."CandidaturaVaga" DROP CONSTRAINT "CandidaturaVaga_candidatoId_fkey";

-- DropForeignKey
ALTER TABLE "CandidaturaVaga"."CandidaturaVaga" DROP CONSTRAINT "CandidaturaVaga_processoSeletivoEtapaId_fkey";

-- DropForeignKey
ALTER TABLE "CandidaturaVaga"."CandidaturaVaga" DROP CONSTRAINT "CandidaturaVaga_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "Cliente"."Cliente" DROP CONSTRAINT "Cliente_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "Cliente"."Cliente" DROP CONSTRAINT "Cliente_usuarioSistemaId_fkey";

-- DropForeignKey
ALTER TABLE "Contato"."Contato" DROP CONSTRAINT "Contato_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "Contato"."Contato" DROP CONSTRAINT "Contato_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "Formacao"."Formacao" DROP CONSTRAINT "Formacao_candidatoId_fkey";

-- DropForeignKey
ALTER TABLE "Funcionario"."Funcionario" DROP CONSTRAINT "Funcionario_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "Funcionario"."Funcionario" DROP CONSTRAINT "Funcionario_usuarioSistemaId_fkey";

-- DropForeignKey
ALTER TABLE "Localizacao"."Localizacao" DROP CONSTRAINT "Localizacao_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "Localizacao"."Localizacao" DROP CONSTRAINT "Localizacao_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "Pessoa"."Pessoa" DROP CONSTRAINT "Pessoa_empresaRepresentadaId_fkey";

-- DropForeignKey
ALTER TABLE "Socio"."Socio" DROP CONSTRAINT "Socio_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "Socio"."Socio" DROP CONSTRAINT "Socio_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "TriagemVaga"."TriagemVaga" DROP CONSTRAINT "TriagemVaga_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "Vaga"."Vaga" DROP CONSTRAINT "Vaga_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Vaga"."Vaga" DROP CONSTRAINT "Vaga_localizacaoId_fkey";

-- DropForeignKey
ALTER TABLE "VagaAnexo"."VagaAnexo" DROP CONSTRAINT "VagaAnexo_anexoId_fkey";

-- DropForeignKey
ALTER TABLE "VagaAnexo"."VagaAnexo" DROP CONSTRAINT "VagaAnexo_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "VagaBeneficio"."VagaBeneficio" DROP CONSTRAINT "VagaBeneficio_beneficioId_fkey";

-- DropForeignKey
ALTER TABLE "VagaBeneficio"."VagaBeneficio" DROP CONSTRAINT "VagaBeneficio_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "VagaHabilidade"."VagaHabilidade" DROP CONSTRAINT "VagaHabilidade_habilidadeId_fkey";

-- DropForeignKey
ALTER TABLE "VagaHabilidade"."VagaHabilidade" DROP CONSTRAINT "VagaHabilidade_vagaId_fkey";

-- DropIndex
DROP INDEX "Socio"."Socio_pessoaId_empresaId_key";

-- AlterTable
ALTER TABLE "Agenda"."Agenda" DROP COLUMN "tipoEvento",
ADD COLUMN     "tipoEvento" "public"."TipoEventoAgenda" NOT NULL;

-- AlterTable
ALTER TABLE "Candidato"."Candidato" DROP COLUMN "areaCandidato",
ADD COLUMN     "areaCandidato" "public"."AreaCandidato" NOT NULL;

-- AlterTable
ALTER TABLE "CandidaturaVaga"."CandidaturaVaga" DROP COLUMN "status",
ADD COLUMN     "status" "public"."StatusCandidatura" NOT NULL DEFAULT 'APLICADO';

-- AlterTable
ALTER TABLE "Cliente"."Cliente" DROP COLUMN "tipoServico",
ADD COLUMN     "tipoServico" "public"."TipoServico"[],
DROP COLUMN "status",
ADD COLUMN     "status" "public"."StatusCliente" NOT NULL;

-- AlterTable
ALTER TABLE "Pessoa"."Pessoa" DROP COLUMN "estadoCivil",
ADD COLUMN     "estadoCivil" "public"."EstadoCivil";

-- AlterTable
ALTER TABLE "ProcessoSeletivoEtapa"."ProcessoSeletivoEtapa" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "public"."TipoEtapa" NOT NULL;

-- AlterTable
ALTER TABLE "Socio"."Socio" DROP COLUMN "tipoSocio",
ADD COLUMN     "tipoSocio" "public"."TipoSocio" NOT NULL;

-- AlterTable
ALTER TABLE "UsuarioSistema"."UsuarioSistema" DROP COLUMN "tipoUsuario",
ADD COLUMN     "tipoUsuario" "public"."TipoUsuario" NOT NULL;

-- AlterTable
ALTER TABLE "Vaga"."Vaga" DROP COLUMN "categoria",
ADD COLUMN     "categoria" "public"."CategoriaVaga" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."StatusVaga" NOT NULL,
DROP COLUMN "tipoContrato",
ADD COLUMN     "tipoContrato" "public"."TipoContrato",
DROP COLUMN "nivelExperiencia",
ADD COLUMN     "nivelExperiencia" "public"."NivelExperiencia",
DROP COLUMN "areaCandidato",
ADD COLUMN     "areaCandidato" "public"."AreaCandidato",
DROP COLUMN "moeda",
ADD COLUMN     "moeda" "public"."Moeda",
DROP COLUMN "periodicidade",
ADD COLUMN     "periodicidade" "public"."PeriodicidadeSalario";

-- CreateIndex
CREATE INDEX "Agenda_etapaAtualId_idx" ON "Agenda"."Agenda"("etapaAtualId");

-- CreateIndex
CREATE INDEX "Agenda_localizacaoId_idx" ON "Agenda"."Agenda"("localizacaoId");

-- CreateIndex
CREATE INDEX "Agenda_vagaId_idx" ON "Agenda"."Agenda"("vagaId");

-- CreateIndex
CREATE INDEX "Agenda_clienteId_idx" ON "Agenda"."Agenda"("clienteId");

-- CreateIndex
CREATE INDEX "Agenda_triagemId_idx" ON "Agenda"."Agenda"("triagemId");

-- CreateIndex
CREATE INDEX "AgendaCandidatura_agendaId_idx" ON "AgendaCandidatura"."AgendaCandidatura"("agendaId");

-- CreateIndex
CREATE INDEX "AgendaCandidatura_candidaturaId_idx" ON "AgendaCandidatura"."AgendaCandidatura"("candidaturaId");

-- CreateIndex
CREATE INDEX "CandidaturaVaga_vagaId_idx" ON "CandidaturaVaga"."CandidaturaVaga"("vagaId");

-- CreateIndex
CREATE INDEX "CandidaturaVaga_processoSeletivoEtapaId_idx" ON "CandidaturaVaga"."CandidaturaVaga"("processoSeletivoEtapaId");

-- CreateIndex
CREATE INDEX "Contato_empresaId_idx" ON "Contato"."Contato"("empresaId");

-- CreateIndex
CREATE INDEX "Contato_pessoaId_idx" ON "Contato"."Contato"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_pessoaId_key" ON "Socio"."Socio"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_empresaId_key" ON "Socio"."Socio"("empresaId");

-- CreateIndex
CREATE INDEX "VagaAnexo_anexoId_idx" ON "VagaAnexo"."VagaAnexo"("anexoId");

-- CreateIndex
CREATE INDEX "VagaBeneficio_beneficioId_idx" ON "VagaBeneficio"."VagaBeneficio"("beneficioId");

-- CreateIndex
CREATE INDEX "VagaHabilidade_habilidadeId_idx" ON "VagaHabilidade"."VagaHabilidade"("habilidadeId");
