-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('ADMIN', 'MODERADOR', 'ATENDENTE', 'PROFISSIONAL');

-- CreateEnum
CREATE TYPE "public"."TipoPessoa" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "public"."AreaProfissional" AS ENUM ('MEDICINA', 'ENFERMAGEM', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'SEPARADO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "public"."TipoSocio" AS ENUM ('REPRESENTANTE', 'SOCIO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "public"."TipoServico" AS ENUM ('RECRUTAMENTO_CONTRATUAL', 'RECRUTAMENTO_DISPARO_CURRICULO', 'RECRUTAMENTO_INFORMACAO', 'PLATAFORMA');

-- CreateTable
CREATE TABLE "public"."Pessoa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "rg" INTEGER,
    "estadoCivil" "public"."EstadoCivil",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
CREATE TABLE "public"."Funcionario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipoUsuario" "public"."TipoUsuario" NOT NULL,
    "setor" TEXT,
    "cargo" TEXT,
    "pessoaId" TEXT,
    "empresaId" TEXT,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cliente" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipoServico" "public"."TipoServico"[],
    "profissionalId" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profissional" (
    "id" TEXT NOT NULL,
    "area" "public"."AreaProfissional" NOT NULL,
    "pessoaId" TEXT,
    "crm" TEXT,
    "corem" TEXT,
    "rqe" TEXT,
    "especialidadeId" INTEGER,

    CONSTRAINT "Profissional_pkey" PRIMARY KEY ("id")
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
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
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
    "area" "public"."AreaProfissional" NOT NULL,
    "empresaId" TEXT,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Especialidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_cpf_key" ON "public"."Pessoa"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "public"."Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_email_key" ON "public"."Funcionario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_pessoaId_key" ON "public"."Funcionario"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_empresaId_key" ON "public"."Funcionario"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_empresaId_key" ON "public"."Cliente"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_profissionalId_key" ON "public"."Cliente"("profissionalId");

-- CreateIndex
CREATE UNIQUE INDEX "Profissional_pessoaId_key" ON "public"."Profissional"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_pessoaId_empresaId_key" ON "public"."Socio"("pessoaId", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_nome_key" ON "public"."Especialidade"("nome");

-- AddForeignKey
ALTER TABLE "public"."Funcionario" ADD CONSTRAINT "Funcionario_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Funcionario" ADD CONSTRAINT "Funcionario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cliente" ADD CONSTRAINT "Cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cliente" ADD CONSTRAINT "Cliente_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "public"."Profissional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profissional" ADD CONSTRAINT "Profissional_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profissional" ADD CONSTRAINT "Profissional_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "public"."Especialidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "public"."Vaga" ADD CONSTRAINT "Vaga_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
