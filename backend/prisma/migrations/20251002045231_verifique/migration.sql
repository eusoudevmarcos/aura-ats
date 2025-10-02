/*
  Warnings:

  - You are about to drop the `Agenda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgendaCandidatura` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Anexo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Beneficio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Candidato` table. If the table is not empty, all the data it contains will be lost.
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
  - You are about to drop the `TriagemVaga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsuarioSistema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vaga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VagaAnexo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VagaBeneficio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VagaHabilidade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Agenda"."Agenda";

-- DropTable
DROP TABLE "AgendaCandidatura"."AgendaCandidatura";

-- DropTable
DROP TABLE "Anexo"."Anexo";

-- DropTable
DROP TABLE "Beneficio"."Beneficio";

-- DropTable
DROP TABLE "Candidato"."Candidato";

-- DropTable
DROP TABLE "CandidaturaVaga"."CandidaturaVaga";

-- DropTable
DROP TABLE "Cliente"."Cliente";

-- DropTable
DROP TABLE "Contato"."Contato";

-- DropTable
DROP TABLE "Empresa"."Empresa";

-- DropTable
DROP TABLE "Especialidade"."Especialidade";

-- DropTable
DROP TABLE "Formacao"."Formacao";

-- DropTable
DROP TABLE "Funcionario"."Funcionario";

-- DropTable
DROP TABLE "Habilidade"."Habilidade";

-- DropTable
DROP TABLE "Localizacao"."Localizacao";

-- DropTable
DROP TABLE "Pessoa"."Pessoa";

-- DropTable
DROP TABLE "ProcessoSeletivoEtapa"."ProcessoSeletivoEtapa";

-- DropTable
DROP TABLE "Socio"."Socio";

-- DropTable
DROP TABLE "TriagemVaga"."TriagemVaga";

-- DropTable
DROP TABLE "UsuarioSistema"."UsuarioSistema";

-- DropTable
DROP TABLE "Vaga"."Vaga";

-- DropTable
DROP TABLE "VagaAnexo"."VagaAnexo";

-- DropTable
DROP TABLE "VagaBeneficio"."VagaBeneficio";

-- DropTable
DROP TABLE "VagaHabilidade"."VagaHabilidade";

-- DropEnum
DROP TYPE "public"."AreaCandidato";

-- DropEnum
DROP TYPE "public"."CategoriaVaga";

-- DropEnum
DROP TYPE "public"."EstadoCivil";

-- DropEnum
DROP TYPE "public"."Moeda";

-- DropEnum
DROP TYPE "public"."NivelExperiencia";

-- DropEnum
DROP TYPE "public"."PeriodicidadeSalario";

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
