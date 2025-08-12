-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('ADMIN_SISTEMA', 'ADMINISTRATIVO', 'MODERADOR', 'RECRUTADOR', 'VENDEDOR', 'CLIENTE_ATS', 'CLIENTE_ATS_CRM');

-- CreateEnum
CREATE TYPE "public"."TipoPessoa" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "public"."AreaCandidato" AS ENUM ('MEDICINA', 'ENFERMAGEM', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'SEPARADO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "public"."TipoSocio" AS ENUM ('REPRESENTANTE', 'SOCIO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "public"."TipoServico" AS ENUM ('RECRUTAMENTO_CONTRATUAL', 'RECRUTAMENTO_DISPARO_CURRICULO', 'RECRUTAMENTO_INFORMACAO', 'PLATAFORMA');

-- CreateEnum
CREATE TYPE "public"."StatusCliente" AS ENUM ('ATIVO', 'INATIVO', 'PENDENTE', 'LEAD');

-- CreateTable
CREATE TABLE "public"."Pessoa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "rg" TEXT,
    "estadoCivil" "public"."EstadoCivil",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaRepresentadaId" TEXT,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Empresa" (
    "id" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "dataAbertura" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsuarioSistema" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipoUsuario" "public"."TipoUsuario" NOT NULL,
    "setor" TEXT,
    "cargo" TEXT,
    "pessoaId" TEXT,
    "empresaId" TEXT,

    CONSTRAINT "UsuarioSistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cliente" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipoServico" "public"."TipoServico"[],
    "status" "public"."StatusCliente" NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Candidato" (
    "id" TEXT NOT NULL,
    "areaCandidato" "public"."AreaCandidato" NOT NULL,
    "pessoaId" TEXT,
    "crm" TEXT,
    "corem" TEXT,
    "rqe" TEXT,
    "especialidadeId" INTEGER,
    "agendaId" TEXT,

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Socio" (
    "id" TEXT NOT NULL,
    "pessoaId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipoSocio" "public"."TipoSocio" NOT NULL,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contato" (
    "id" TEXT NOT NULL,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "pessoaId" TEXT,
    "empresaId" TEXT,

    CONSTRAINT "Contato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Localizacao" (
    "id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "estado" TEXT,
    "complemento" TEXT,
    "logradouro" TEXT,
    "regiao" TEXT,
    "pessoaId" TEXT,
    "empresaId" TEXT,

    CONSTRAINT "Localizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Formacao" (
    "id" TEXT NOT NULL,
    "dataConclusaoMedicina" TIMESTAMP(3),
    "dataConclusaoResidencia" TIMESTAMP(3),
    "pessoaId" TEXT,

    CONSTRAINT "Formacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vaga" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "areaCandidato" "public"."AreaCandidato" NOT NULL,
    "clienteId" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agenda" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Especialidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CandidatoToVaga" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CandidatoToVaga_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_cpf_key" ON "public"."Pessoa"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "public"."Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_email_key" ON "public"."UsuarioSistema"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_pessoaId_key" ON "public"."UsuarioSistema"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_empresaId_key" ON "public"."UsuarioSistema"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_empresaId_key" ON "public"."Cliente"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_pessoaId_key" ON "public"."Candidato"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_pessoaId_empresaId_key" ON "public"."Socio"("pessoaId", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_nome_key" ON "public"."Especialidade"("nome");

-- CreateIndex
CREATE INDEX "_CandidatoToVaga_B_index" ON "public"."_CandidatoToVaga"("B");

-- AddForeignKey
ALTER TABLE "public"."Pessoa" ADD CONSTRAINT "Pessoa_empresaRepresentadaId_fkey" FOREIGN KEY ("empresaRepresentadaId") REFERENCES "public"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioSistema" ADD CONSTRAINT "UsuarioSistema_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioSistema" ADD CONSTRAINT "UsuarioSistema_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cliente" ADD CONSTRAINT "Cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Candidato" ADD CONSTRAINT "Candidato_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Candidato" ADD CONSTRAINT "Candidato_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "public"."Especialidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Socio" ADD CONSTRAINT "Socio_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Socio" ADD CONSTRAINT "Socio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contato" ADD CONSTRAINT "Contato_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contato" ADD CONSTRAINT "Contato_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Localizacao" ADD CONSTRAINT "Localizacao_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Localizacao" ADD CONSTRAINT "Localizacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Formacao" ADD CONSTRAINT "Formacao_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vaga" ADD CONSTRAINT "Vaga_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vaga" ADD CONSTRAINT "Vaga_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "public"."Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CandidatoToVaga" ADD CONSTRAINT "_CandidatoToVaga_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CandidatoToVaga" ADD CONSTRAINT "_CandidatoToVaga_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
