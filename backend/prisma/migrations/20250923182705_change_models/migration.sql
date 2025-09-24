-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Agenda";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "AgendaCandidatura";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Anexo";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "AreaCandidato";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Beneficio";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Candidato";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "CandidaturaVaga";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "CategoriaVaga";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Cliente";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Contato";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Empresa";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Especialidade";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "EstadoCivil";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Formacao";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Funcionario";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Habilidade";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Localizacao";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Moeda";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "NivelExperiencia";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "PeriodicidadeSalario";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Pessoa";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Socio";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "StatusCandidatura";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "StatusCliente";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "StatusVaga";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "TipoContrato";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "TipoEtapa";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "TipoEventoAgenda";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "TipoPessoa";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "TipoServico";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "TipoSocio";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "TipoUsuario";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "TriagemVaga";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "UsuarioSistema";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Vaga";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "VagaAnexo";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "VagaBeneficio";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "VagaHabilidade";

-- CreateEnum
CREATE TYPE "TipoSocio"."TipoSocio" AS ENUM ('REPRESENTANTE', 'SOCIO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "CategoriaVaga"."CategoriaVaga" AS ENUM ('TECNOLOGIA', 'SAUDE', 'ADMINISTRATIVO', 'FINANCEIRO', 'RECURSOS_HUMANOS', 'MARKETING', 'VENDAS', 'OUTROS');

-- CreateEnum
CREATE TYPE "StatusVaga"."StatusVaga" AS ENUM ('ATIVA', 'PAUSADA', 'ENCERRADA', 'ARQUIVADA');

-- CreateEnum
CREATE TYPE "TipoContrato"."TipoContrato" AS ENUM ('CLT', 'PJ', 'ESTAGIO', 'FREELANCER', 'TEMPORARIO');

-- CreateEnum
CREATE TYPE "NivelExperiencia"."NivelExperiencia" AS ENUM ('ESTAGIO', 'JUNIOR', 'PLENO', 'SENIOR', 'ESPECIALISTA', 'GERENTE');

-- CreateEnum
CREATE TYPE "TipoEtapa"."TipoEtapa" AS ENUM ('APLICACAO', 'TRIAGEM', 'TESTE', 'ENTREVISTA', 'OFERTA', 'CONTRATACAO');

-- CreateEnum
CREATE TYPE "StatusCandidatura"."StatusCandidatura" AS ENUM ('APLICADO', 'EM_ANALISE', 'ENTREVISTA_AGENDADA', 'ENTREVISTA_CONCLUIDA', 'OFERTA_ENVIADA', 'OFERTA_ACEITA', 'OFERTA_RECUSADA', 'DESCLASSIFICADO', 'CONTRATADO');

-- CreateEnum
CREATE TYPE "TipoServico"."TipoServico" AS ENUM ('RECRUTAMENTO_CONTRATUAL', 'RECRUTAMENTO_DISPARO_CURRICULO', 'RECRUTAMENTO_INFORMACAO', 'PLATAFORMA');

-- CreateEnum
CREATE TYPE "AreaCandidato"."AreaCandidato" AS ENUM ('MEDICINA', 'ENFERMAGEM', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusCliente"."StatusCliente" AS ENUM ('PROSPECT', 'LEAD', 'ATIVO', 'INATIVO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "TipoEventoAgenda"."TipoEventoAgenda" AS ENUM ('TRIAGEM_INICIAL', 'ENTREVISTA_RH', 'ENTREVISTA_GESTOR', 'TESTE_TECNICO', 'TESTE_PSICOLOGICO', 'DINAMICA_GRUPO', 'PROPOSTA', 'OUTRO');

-- CreateEnum
CREATE TYPE "Moeda"."Moeda" AS ENUM ('BRL', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "PeriodicidadeSalario"."PeriodicidadeSalario" AS ENUM ('HORA', 'DIA', 'MES', 'ANO');

-- CreateEnum
CREATE TYPE "EstadoCivil"."EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'SEPARADO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "TipoUsuario"."TipoUsuario" AS ENUM ('ADMIN_SISTEMA', 'ADMINISTRATIVO', 'MODERADOR', 'RECRUTADOR', 'VENDEDOR', 'CLIENTE_ATS', 'CLIENTE_ATS_CRM', 'CLIENTE_CRM');

-- CreateEnum
CREATE TYPE "TipoPessoa"."TipoPessoa" AS ENUM ('FISICA', 'JURIDICA');

-- CreateTable
CREATE TABLE "Agenda"."Agenda" (
    "id" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "link" TEXT,
    "tipoEvento" "TipoEventoAgenda"."TipoEventoAgenda" NOT NULL,
    "localizacaoId" TEXT,
    "clienteId" TEXT,
    "triagemId" TEXT,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaCandidatura"."AgendaCandidatura" (
    "id" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,
    "candidaturaId" TEXT NOT NULL,

    CONSTRAINT "AgendaCandidatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidato"."Candidato" (
    "id" TEXT NOT NULL,
    "crm" TEXT,
    "corem" TEXT,
    "rqe" TEXT,
    "areaCandidato" "AreaCandidato"."AreaCandidato" NOT NULL,
    "pessoaId" TEXT NOT NULL,
    "especialidadeId" INTEGER,

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especialidade"."Especialidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formacao"."Formacao" (
    "id" TEXT NOT NULL,
    "instituicao" TEXT DEFAULT 'A definir',
    "curso" TEXT DEFAULT 'A definir',
    "dataInicio" TIMESTAMP(3),
    "dataFim" TIMESTAMP(3),
    "dataInicioResidencia" TIMESTAMP(3),
    "dataFimResidencia" TIMESTAMP(3),
    "candidatoId" TEXT,

    CONSTRAINT "Formacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente"."Cliente" (
    "id" TEXT NOT NULL,
    "tipoServico" "TipoServico"."TipoServico"[],
    "status" "StatusCliente"."StatusCliente" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contato"."Contato" (
    "id" TEXT NOT NULL,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "pessoaId" TEXT,
    "empresaId" TEXT,

    CONSTRAINT "Contato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa"."Empresa" (
    "id" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "dataAbertura" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomeFantasia" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Socio"."Socio" (
    "id" TEXT NOT NULL,
    "pessoaId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipoSocio" "TipoSocio"."TipoSocio" NOT NULL,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habilidade"."Habilidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoHabilidade" TEXT,

    CONSTRAINT "Habilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localizacao"."Localizacao" (
    "id" TEXT NOT NULL,
    "cep" TEXT,
    "cidade" TEXT,
    "bairro" TEXT,
    "uf" TEXT NOT NULL,
    "estado" TEXT,
    "complemento" TEXT,
    "logradouro" TEXT,
    "regiao" TEXT,
    "descricao" TEXT,
    "empresaId" TEXT,
    "pessoaId" TEXT,

    CONSTRAINT "Localizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pessoa"."Pessoa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "rg" TEXT,
    "estadoCivil" "EstadoCivil"."EstadoCivil",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaRepresentadaId" TEXT,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriagemVaga"."TriagemVaga" (
    "id" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "TriagemVaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioSistema"."UsuarioSistema" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipoUsuario" "TipoUsuario"."TipoUsuario" NOT NULL,
    "empresaId" TEXT,
    "pessoaId" TEXT,

    CONSTRAINT "UsuarioSistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funcionario"."Funcionario" (
    "id" TEXT NOT NULL,
    "setor" VARCHAR(100),
    "cargo" VARCHAR(100),
    "usuarioSistemaId" TEXT NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaga"."Vaga" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "requisitos" TEXT,
    "responsabilidades" TEXT,
    "dataPublicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFechamento" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "categoria" "CategoriaVaga"."CategoriaVaga" NOT NULL,
    "status" "StatusVaga"."StatusVaga" NOT NULL,
    "tipoContrato" "TipoContrato"."TipoContrato",
    "nivelExperiencia" "NivelExperiencia"."NivelExperiencia",
    "areaCandidato" "AreaCandidato"."AreaCandidato",
    "salario" DECIMAL(12,2),
    "moeda" "Moeda"."Moeda",
    "periodicidade" "PeriodicidadeSalario"."PeriodicidadeSalario",
    "clienteId" TEXT,
    "localizacaoId" TEXT,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VagaHabilidade"."VagaHabilidade" (
    "nivelExigido" TEXT,
    "habilidadeId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "VagaHabilidade_pkey" PRIMARY KEY ("vagaId","habilidadeId")
);

-- CreateTable
CREATE TABLE "CandidaturaVaga"."CandidaturaVaga" (
    "id" TEXT NOT NULL,
    "status" "StatusCandidatura"."StatusCandidatura" NOT NULL DEFAULT 'APLICADO',
    "dataAplicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "candidatoId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "CandidaturaVaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anexo"."Anexo" (
    "id" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT,
    "tamanhoKb" INTEGER,

    CONSTRAINT "Anexo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VagaAnexo"."VagaAnexo" (
    "anexoId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "VagaAnexo_pkey" PRIMARY KEY ("vagaId","anexoId")
);

-- CreateTable
CREATE TABLE "Beneficio"."Beneficio" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Beneficio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VagaBeneficio"."VagaBeneficio" (
    "beneficioId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "VagaBeneficio_pkey" PRIMARY KEY ("vagaId","beneficioId")
);

-- CreateIndex
CREATE INDEX "Agenda_localizacaoId_idx" ON "Agenda"."Agenda"("localizacaoId");

-- CreateIndex
CREATE INDEX "Agenda_clienteId_idx" ON "Agenda"."Agenda"("clienteId");

-- CreateIndex
CREATE INDEX "Agenda_triagemId_idx" ON "Agenda"."Agenda"("triagemId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_pessoaId_key" ON "Candidato"."Candidato"("pessoaId");

-- CreateIndex
CREATE INDEX "Candidato_especialidadeId_idx" ON "Candidato"."Candidato"("especialidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_nome_key" ON "Especialidade"."Especialidade"("nome");

-- CreateIndex
CREATE INDEX "Formacao_candidatoId_idx" ON "Formacao"."Formacao"("candidatoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_empresaId_key" ON "Cliente"."Cliente"("empresaId");

-- CreateIndex
CREATE INDEX "Cliente_empresaId_idx" ON "Cliente"."Cliente"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"."Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_pessoaId_empresaId_key" ON "Socio"."Socio"("pessoaId", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Habilidade_nome_key" ON "Habilidade"."Habilidade"("nome");

-- CreateIndex
CREATE INDEX "Localizacao_pessoaId_idx" ON "Localizacao"."Localizacao"("pessoaId");

-- CreateIndex
CREATE INDEX "Localizacao_empresaId_idx" ON "Localizacao"."Localizacao"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_cpf_key" ON "Pessoa"."Pessoa"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_empresaId_key" ON "UsuarioSistema"."UsuarioSistema"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_pessoaId_key" ON "UsuarioSistema"."UsuarioSistema"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_email_key" ON "UsuarioSistema"."UsuarioSistema"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_usuarioSistemaId_key" ON "Funcionario"."Funcionario"("usuarioSistemaId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidaturaVaga_candidatoId_vagaId_key" ON "CandidaturaVaga"."CandidaturaVaga"("candidatoId", "vagaId");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficio_nome_key" ON "Beneficio"."Beneficio"("nome");

-- AddForeignKey
ALTER TABLE "Agenda"."Agenda" ADD CONSTRAINT "Agenda_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "Localizacao"."Localizacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda"."Agenda" ADD CONSTRAINT "Agenda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"."Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda"."Agenda" ADD CONSTRAINT "Agenda_triagemId_fkey" FOREIGN KEY ("triagemId") REFERENCES "TriagemVaga"."TriagemVaga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaCandidatura"."AgendaCandidatura" ADD CONSTRAINT "AgendaCandidatura_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"."Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaCandidatura"."AgendaCandidatura" ADD CONSTRAINT "AgendaCandidatura_candidaturaId_fkey" FOREIGN KEY ("candidaturaId") REFERENCES "CandidaturaVaga"."CandidaturaVaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato"."Candidato" ADD CONSTRAINT "Candidato_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"."Especialidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato"."Candidato" ADD CONSTRAINT "Candidato_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"."Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formacao"."Formacao" ADD CONSTRAINT "Formacao_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"."Candidato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente"."Cliente" ADD CONSTRAINT "Cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contato"."Contato" ADD CONSTRAINT "Contato_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contato"."Contato" ADD CONSTRAINT "Contato_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio"."Socio" ADD CONSTRAINT "Socio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio"."Socio" ADD CONSTRAINT "Socio_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"."Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localizacao"."Localizacao" ADD CONSTRAINT "Localizacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localizacao"."Localizacao" ADD CONSTRAINT "Localizacao_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pessoa"."Pessoa" ADD CONSTRAINT "Pessoa_empresaRepresentadaId_fkey" FOREIGN KEY ("empresaRepresentadaId") REFERENCES "Empresa"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriagemVaga"."TriagemVaga" ADD CONSTRAINT "TriagemVaga_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"."Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioSistema"."UsuarioSistema" ADD CONSTRAINT "UsuarioSistema_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioSistema"."UsuarioSistema" ADD CONSTRAINT "UsuarioSistema_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funcionario"."Funcionario" ADD CONSTRAINT "Funcionario_usuarioSistemaId_fkey" FOREIGN KEY ("usuarioSistemaId") REFERENCES "UsuarioSistema"."UsuarioSistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga"."Vaga" ADD CONSTRAINT "Vaga_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"."Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga"."Vaga" ADD CONSTRAINT "Vaga_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "Localizacao"."Localizacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaHabilidade"."VagaHabilidade" ADD CONSTRAINT "VagaHabilidade_habilidadeId_fkey" FOREIGN KEY ("habilidadeId") REFERENCES "Habilidade"."Habilidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaHabilidade"."VagaHabilidade" ADD CONSTRAINT "VagaHabilidade_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"."Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidaturaVaga"."CandidaturaVaga" ADD CONSTRAINT "CandidaturaVaga_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"."Candidato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidaturaVaga"."CandidaturaVaga" ADD CONSTRAINT "CandidaturaVaga_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"."Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaAnexo"."VagaAnexo" ADD CONSTRAINT "VagaAnexo_anexoId_fkey" FOREIGN KEY ("anexoId") REFERENCES "Anexo"."Anexo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaAnexo"."VagaAnexo" ADD CONSTRAINT "VagaAnexo_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"."Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaBeneficio"."VagaBeneficio" ADD CONSTRAINT "VagaBeneficio_beneficioId_fkey" FOREIGN KEY ("beneficioId") REFERENCES "Beneficio"."Beneficio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaBeneficio"."VagaBeneficio" ADD CONSTRAINT "VagaBeneficio_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"."Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
