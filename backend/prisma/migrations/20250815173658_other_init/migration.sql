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
ALTER TABLE "aura"."AgendaVaga" DROP CONSTRAINT "AgendaVaga_etapaAtualId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."AgendaVaga" DROP CONSTRAINT "AgendaVaga_localizacaoId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."AgendaVaga" DROP CONSTRAINT "AgendaVaga_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Beneficio" DROP CONSTRAINT "Beneficio_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Candidato" DROP CONSTRAINT "Candidato_especialidadeId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Candidato" DROP CONSTRAINT "Candidato_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."CandidatoHabilidade" DROP CONSTRAINT "CandidatoHabilidade_candidatoId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."CandidatoHabilidade" DROP CONSTRAINT "CandidatoHabilidade_habilidadeId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."CandidaturaVaga" DROP CONSTRAINT "CandidaturaVaga_candidatoId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."CandidaturaVaga" DROP CONSTRAINT "CandidaturaVaga_etapaAtualId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."CandidaturaVaga" DROP CONSTRAINT "CandidaturaVaga_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Cliente" DROP CONSTRAINT "Cliente_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Contato" DROP CONSTRAINT "Contato_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Contato" DROP CONSTRAINT "Contato_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Formacao" DROP CONSTRAINT "Formacao_candidatoId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Funcionario" DROP CONSTRAINT "Funcionario_usuarioSistemaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Localizacao" DROP CONSTRAINT "Localizacao_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Localizacao" DROP CONSTRAINT "Localizacao_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Pessoa" DROP CONSTRAINT "Pessoa_empresaRepresentadaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Socio" DROP CONSTRAINT "Socio_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Socio" DROP CONSTRAINT "Socio_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."UsuarioSistema" DROP CONSTRAINT "UsuarioSistema_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."UsuarioSistema" DROP CONSTRAINT "UsuarioSistema_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Vaga" DROP CONSTRAINT "Vaga_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."Vaga" DROP CONSTRAINT "Vaga_localizacaoId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."VagaAnexo" DROP CONSTRAINT "VagaAnexo_anexoId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."VagaAnexo" DROP CONSTRAINT "VagaAnexo_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."VagaHabilidade" DROP CONSTRAINT "VagaHabilidade_habilidadeId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."VagaHabilidade" DROP CONSTRAINT "VagaHabilidade_vagaId_fkey";

-- DropForeignKey
ALTER TABLE "aura"."_CandidatoToVaga" DROP CONSTRAINT "_CandidatoToVaga_A_fkey";

-- DropForeignKey
ALTER TABLE "aura"."_CandidatoToVaga" DROP CONSTRAINT "_CandidatoToVaga_B_fkey";

-- DropTable
DROP TABLE "aura"."AgendaVaga";

-- DropTable
DROP TABLE "aura"."Anexo";

-- DropTable
DROP TABLE "aura"."Beneficio";

-- DropTable
DROP TABLE "aura"."Candidato";

-- DropTable
DROP TABLE "aura"."CandidatoHabilidade";

-- DropTable
DROP TABLE "aura"."CandidaturaVaga";

-- DropTable
DROP TABLE "aura"."Cliente";

-- DropTable
DROP TABLE "aura"."Contato";

-- DropTable
DROP TABLE "aura"."Empresa";

-- DropTable
DROP TABLE "aura"."Especialidade";

-- DropTable
DROP TABLE "aura"."Formacao";

-- DropTable
DROP TABLE "aura"."Funcionario";

-- DropTable
DROP TABLE "aura"."Habilidade";

-- DropTable
DROP TABLE "aura"."Localizacao";

-- DropTable
DROP TABLE "aura"."Pessoa";

-- DropTable
DROP TABLE "aura"."ProcessoSeletivoEtapa";

-- DropTable
DROP TABLE "aura"."Socio";

-- DropTable
DROP TABLE "aura"."UsuarioSistema";

-- DropTable
DROP TABLE "aura"."Vaga";

-- DropTable
DROP TABLE "aura"."VagaAnexo";

-- DropTable
DROP TABLE "aura"."VagaHabilidade";

-- DropTable
DROP TABLE "aura"."_CandidatoToVaga";

-- DropEnum
DROP TYPE "aura"."AreaCandidato";

-- DropEnum
DROP TYPE "aura"."CategoriaVaga";

-- DropEnum
DROP TYPE "aura"."EstadoCivil";

-- DropEnum
DROP TYPE "aura"."NivelExperiencia";

-- DropEnum
DROP TYPE "aura"."StatusCandidatura";

-- DropEnum
DROP TYPE "aura"."StatusCliente";

-- DropEnum
DROP TYPE "aura"."StatusVaga";

-- DropEnum
DROP TYPE "aura"."TipoContrato";

-- DropEnum
DROP TYPE "aura"."TipoEtapa";

-- DropEnum
DROP TYPE "aura"."TipoEventoAgenda";

-- DropEnum
DROP TYPE "aura"."TipoPessoa";

-- DropEnum
DROP TYPE "aura"."TipoServico";

-- DropEnum
DROP TYPE "aura"."TipoSocio";

-- DropEnum
DROP TYPE "aura"."TipoUsuario";
