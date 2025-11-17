/*
  Warnings:

  - A unique constraint covering the columns `[medicoId]` on the table `Candidato` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."Sexo" AS ENUM ('MASCULINO', 'FEMININO');

-- CreateEnum
CREATE TYPE "public"."Signo" AS ENUM ('ARIES', 'TOURO', 'GEMEOS', 'CANCER', 'LEAO', 'VIRGEM', 'LIBRA', 'ESCORPIAO', 'SAGITARIO', 'CAPRICORNIO', 'AQUARIO', 'PEIXES');

-- AlterTable
ALTER TABLE "Candidato"."Candidato" ADD COLUMN     "medicoId" TEXT,
ADD COLUMN     "sexo" "public"."Sexo",
ADD COLUMN     "signo" "public"."Signo";

-- CreateTable
CREATE TABLE "Candidato"."Medico" (
    "id" TEXT NOT NULL,
    "dataInscricaoCrm" TIMESTAMP(3),
    "ufCrm" TIMESTAMP(3),
    "quadroSocietario" BOOLEAN NOT NULL,
    "quadroDeObservações" TEXT,
    "exames" TEXT,
    "especialidadesEnfermidades" TEXT,
    "porcentagemRepasseMedico" TEXT,
    "porcentagemConsultas" TEXT,
    "porcentagemExames" TEXT,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_medicoId_key" ON "Candidato"."Candidato"("medicoId");
