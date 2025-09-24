/*
  Warnings:

  - You are about to drop the `AgendaVaga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Anexo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Beneficio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Candidato` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidatoHabilidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidaturaVaga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contato` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Empresa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Especialidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Formacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Funcionario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Habilidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Localizacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pessoa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProcessoSeletivoEtapa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Socio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsuarioSistema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vaga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VagaAnexo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VagaHabilidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CandidatoToVaga` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AgendaVaga" DROP CONSTRAINT "AgendaVaga_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AgendaVaga" DROP CONSTRAINT "AgendaVaga_etapaAtualId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AgendaVaga" DROP CONSTRAINT "AgendaVaga_localizacaoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AgendaVaga" DROP CONSTRAINT "AgendaVaga_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Beneficio" DROP CONSTRAINT "Beneficio_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Candidato" DROP CONSTRAINT "Candidato_especialidadeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Candidato" DROP CONSTRAINT "Candidato_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CandidatoHabilidade" DROP CONSTRAINT "CandidatoHabilidade_candidatoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CandidatoHabilidade" DROP CONSTRAINT "CandidatoHabilidade_habilidadeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CandidaturaVaga" DROP CONSTRAINT "CandidaturaVaga_candidatoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CandidaturaVaga" DROP CONSTRAINT "CandidaturaVaga_etapaAtualId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CandidaturaVaga" DROP CONSTRAINT "CandidaturaVaga_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Cliente" DROP CONSTRAINT "Cliente_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contato" DROP CONSTRAINT "Contato_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contato" DROP CONSTRAINT "Contato_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Formacao" DROP CONSTRAINT "Formacao_candidatoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Funcionario" DROP CONSTRAINT "Funcionario_usuarioSistemaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Localizacao" DROP CONSTRAINT "Localizacao_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Localizacao" DROP CONSTRAINT "Localizacao_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pessoa" DROP CONSTRAINT "Pessoa_empresaRepresentadaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Socio" DROP CONSTRAINT "Socio_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Socio" DROP CONSTRAINT "Socio_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UsuarioSistema" DROP CONSTRAINT "UsuarioSistema_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UsuarioSistema" DROP CONSTRAINT "UsuarioSistema_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vaga" DROP CONSTRAINT "Vaga_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vaga" DROP CONSTRAINT "Vaga_localizacaoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VagaAnexo" DROP CONSTRAINT "VagaAnexo_anexoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VagaAnexo" DROP CONSTRAINT "VagaAnexo_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VagaHabilidade" DROP CONSTRAINT "VagaHabilidade_habilidadeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VagaHabilidade" DROP CONSTRAINT "VagaHabilidade_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CandidatoToVaga" DROP CONSTRAINT "_CandidatoToVaga_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CandidatoToVaga" DROP CONSTRAINT "_CandidatoToVaga_B_fkey";

-- DropTable
DROP TABLE "public"."AgendaVaga";

-- DropTable
DROP TABLE "public"."Anexo";

-- DropTable
DROP TABLE "public"."Beneficio";

-- DropTable
DROP TABLE "public"."Candidato";

-- DropTable
DROP TABLE "public"."CandidatoHabilidade";

-- DropTable
DROP TABLE "public"."CandidaturaVaga";

-- DropTable
DROP TABLE "public"."Cliente";

-- DropTable
DROP TABLE "public"."Contato";

-- DropTable
DROP TABLE "public"."Empresa";

-- DropTable
DROP TABLE "public"."Especialidade";

-- DropTable
DROP TABLE "public"."Formacao";

-- DropTable
DROP TABLE "public"."Funcionario";

-- DropTable
DROP TABLE "public"."Habilidade";

-- DropTable
DROP TABLE "public"."Localizacao";

-- DropTable
DROP TABLE "public"."Pessoa";

-- DropTable
DROP TABLE "public"."ProcessoSeletivoEtapa";

-- DropTable
DROP TABLE "public"."Socio";

-- DropTable
DROP TABLE "public"."UsuarioSistema";

-- DropTable
DROP TABLE "public"."Vaga";

-- DropTable
DROP TABLE "public"."VagaAnexo";

-- DropTable
DROP TABLE "public"."VagaHabilidade";

-- DropTable
DROP TABLE "public"."_CandidatoToVaga";

-- DropEnum
DROP TYPE "public"."AreaCandidato";

-- DropEnum
DROP TYPE "public"."CategoriaVaga";

-- DropEnum
DROP TYPE "public"."EstadoCivil";

-- DropEnum
DROP TYPE "public"."NivelExperiencia";

-- DropEnum
DROP TYPE "public"."StatusCandidatura";

-- DropEnum
DROP TYPE "public"."StatusCliente";

-- DropEnum
DROP TYPE "public"."StatusVaga";

-- DropEnum
DROP TYPE "public"."TipoContrato";

-- DropEnum
DROP TYPE "public"."TipoEtapa";

-- DropEnum
DROP TYPE "public"."TipoEventoAgenda";

-- DropEnum
DROP TYPE "public"."TipoPessoa";

-- DropEnum
DROP TYPE "public"."TipoServico";

-- DropEnum
DROP TYPE "public"."TipoSocio";

-- DropEnum
DROP TYPE "public"."TipoUsuario";
