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
CREATE TYPE "public"."TipoEventoTriagem" AS ENUM ('TRIAGEM_INICIAL', 'ENTREVISTA_RH', 'ENTREVISTA_GESTOR', 'TESTE_TECNICO', 'TESTE_PSICOLOGICO', 'DINAMICA_GRUPO', 'PROPOSTA', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."Moeda" AS ENUM ('BRL', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "public"."PeriodicidadeSalario" AS ENUM ('HORA', 'DIA', 'MES', 'ANO');

-- CreateEnum
CREATE TYPE "public"."TipoSocio" AS ENUM ('REPRESENTANTE', 'SOCIO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "public"."EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'SEPARADO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('ADMIN_SISTEMA', 'ADMINISTRATIVO', 'MODERADOR', 'RECRUTADOR', 'VENDEDOR', 'CLIENTE_ATS', 'CLIENTE_ATS_CRM', 'CLIENTE_CRM', 'CLIENTE');

-- CreateEnum
CREATE TYPE "public"."TipoPessoa" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "public"."LocalEvento" AS ENUM ('REMOTO', 'PRESENCIAL', 'HIBRIDO');

-- CreateEnum
CREATE TYPE "public"."AssinaturaStatus" AS ENUM ('ATIVA', 'EXPIRADA', 'CANCELADA', 'PENDENTE');

-- CreateEnum
CREATE TYPE "public"."TipoPlano" AS ENUM ('MENSAL', 'POR_USO', 'PERSONALIZADO', 'POR_VAGA', 'PERCENTUAL');

-- CreateEnum
CREATE TYPE "public"."CategoriaPlano" AS ENUM ('PLATAFORMA', 'RECRUTAMENTO_COM_RQE', 'RECRUTAMENTO_SEM_RQE', 'RECRUTAMENTO_DIVERSOS');

-- CreateTable
CREATE TABLE "Agenda"."Agenda" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL DEFAULT 'Titulo',
    "dataHora" TIMESTAMP(3) NOT NULL,
    "link" TEXT,
    "tipoEvento" "public"."TipoEventoAgenda" NOT NULL DEFAULT 'TRIAGEM_INICIAL',
    "localEvento" "public"."LocalEvento" NOT NULL DEFAULT 'REMOTO',
    "convidados" TEXT[],
    "etapaAtualId" TEXT,
    "localizacaoId" TEXT,
    "vagaId" TEXT,
    "clienteId" TEXT,
    "triagemId" TEXT,
    "usuarioSistemaId" TEXT NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessoSeletivoEtapa"."ProcessoSeletivoEtapa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "public"."TipoEtapa" NOT NULL,
    "ordem" INTEGER NOT NULL,
    "descricao" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProcessoSeletivoEtapa_pkey" PRIMARY KEY ("id")
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
    "areaCandidato" "public"."AreaCandidato" NOT NULL,
    "especialidadeId" INTEGER,
    "pessoaId" TEXT NOT NULL,
    "email" TEXT,
    "celular" TEXT,

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
    "status" "public"."StatusCliente" NOT NULL,
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
    "empresaId" TEXT,
    "pessoaId" TEXT,

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
    "tipoSocio" "public"."TipoSocio" NOT NULL,
    "empresaId" TEXT NOT NULL,
    "pessoaId" TEXT NOT NULL,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funcionario"."Funcionario" (
    "id" TEXT NOT NULL,
    "setor" VARCHAR(100),
    "cargo" VARCHAR(100),
    "pessoaId" TEXT,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
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
    "rg" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estadoCivil" "public"."EstadoCivil",
    "empresaRepresentadaId" TEXT,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano"."Plano" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "tipo" "public"."TipoPlano" NOT NULL DEFAULT 'MENSAL',
    "diasGarantia" INTEGER,
    "limiteUso" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoria" "public"."CategoriaPlano",

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano"."PlanoAssinado" (
    "id" TEXT NOT NULL,
    "status" "public"."AssinaturaStatus" NOT NULL DEFAULT 'ATIVA',
    "dataAssinatura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataExpiracao" TIMESTAMP(3),
    "qtdVagas" INTEGER,
    "precoPersonalizado" DECIMAL(10,2),
    "porcentagemMinima" DECIMAL(10,2),
    "observacoes" TEXT,
    "usosDisponiveis" INTEGER,
    "usosConsumidos" INTEGER,
    "clienteId" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,

    CONSTRAINT "PlanoAssinado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano"."PlanoUso" (
    "id" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dataUso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planoAssinaturaId" TEXT NOT NULL,

    CONSTRAINT "PlanoUso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessao"."sessao" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usuarioSistemaId" TEXT NOT NULL,

    CONSTRAINT "sessao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tarefa"."tarefas" (
    "id" SERIAL NOT NULL,
    "idUsuarioSistema" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "orderBy" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriagemVaga"."TriagemVaga" (
    "id" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "tipoTriagem" "public"."TipoEventoTriagem" NOT NULL DEFAULT 'TRIAGEM_INICIAL',
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "TriagemVaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioSistema"."UsuarioSistema" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipoUsuario" "public"."TipoUsuario" NOT NULL,
    "funcionarioId" TEXT,
    "clienteId" TEXT,

    CONSTRAINT "UsuarioSistema_pkey" PRIMARY KEY ("id")
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
    "categoria" "public"."CategoriaVaga" NOT NULL,
    "status" "public"."StatusVaga" NOT NULL,
    "tipoContrato" "public"."TipoContrato",
    "nivelExperiencia" "public"."NivelExperiencia",
    "areaCandidato" "public"."AreaCandidato",
    "salario" DECIMAL(12,2),
    "moeda" "public"."Moeda",
    "tipoSalario" TEXT,
    "periodicidade" "public"."PeriodicidadeSalario",
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
    "status" "public"."StatusCandidatura" NOT NULL DEFAULT 'APLICADO',
    "dataAplicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "candidatoId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,
    "processoSeletivoEtapaId" TEXT,

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

-- CreateTable
CREATE TABLE "Habilidade"."Habilidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoHabilidade" TEXT,

    CONSTRAINT "Habilidade_pkey" PRIMARY KEY ("id")
);

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
CREATE INDEX "Agenda_usuarioSistemaId_idx" ON "Agenda"."Agenda"("usuarioSistemaId");

-- CreateIndex
CREATE INDEX "AgendaCandidatura_agendaId_idx" ON "AgendaCandidatura"."AgendaCandidatura"("agendaId");

-- CreateIndex
CREATE INDEX "AgendaCandidatura_candidaturaId_idx" ON "AgendaCandidatura"."AgendaCandidatura"("candidaturaId");

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
CREATE INDEX "Contato_empresaId_idx" ON "Contato"."Contato"("empresaId");

-- CreateIndex
CREATE INDEX "Contato_pessoaId_idx" ON "Contato"."Contato"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"."Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_pessoaId_key" ON "Socio"."Socio"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_empresaId_key" ON "Socio"."Socio"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_pessoaId_key" ON "Funcionario"."Funcionario"("pessoaId");

-- CreateIndex
CREATE INDEX "Funcionario_pessoaId_idx" ON "Funcionario"."Funcionario"("pessoaId");

-- CreateIndex
CREATE INDEX "Localizacao_pessoaId_idx" ON "Localizacao"."Localizacao"("pessoaId");

-- CreateIndex
CREATE INDEX "Localizacao_empresaId_idx" ON "Localizacao"."Localizacao"("empresaId");

-- CreateIndex
CREATE INDEX "Pessoa_empresaRepresentadaId_idx" ON "Pessoa"."Pessoa"("empresaRepresentadaId");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_cpf_key" ON "Pessoa"."Pessoa"("cpf");

-- CreateIndex
CREATE INDEX "PlanoAssinado_clienteId_idx" ON "Plano"."PlanoAssinado"("clienteId");

-- CreateIndex
CREATE INDEX "PlanoAssinado_planoId_idx" ON "Plano"."PlanoAssinado"("planoId");

-- CreateIndex
CREATE INDEX "PlanoUso_planoAssinaturaId_idx" ON "Plano"."PlanoUso"("planoAssinaturaId");

-- CreateIndex
CREATE UNIQUE INDEX "sessao_token_key" ON "Sessao"."sessao"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessao_usuarioSistemaId_key" ON "Sessao"."sessao"("usuarioSistemaId");

-- CreateIndex
CREATE INDEX "sessao_usuarioSistemaId_idx" ON "Sessao"."sessao"("usuarioSistemaId");

-- CreateIndex
CREATE INDEX "tarefas_idUsuarioSistema_idx" ON "Tarefa"."tarefas"("idUsuarioSistema");

-- CreateIndex
CREATE INDEX "TriagemVaga_vagaId_idx" ON "TriagemVaga"."TriagemVaga"("vagaId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_funcionarioId_key" ON "UsuarioSistema"."UsuarioSistema"("funcionarioId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_clienteId_key" ON "UsuarioSistema"."UsuarioSistema"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_email_key" ON "UsuarioSistema"."UsuarioSistema"("email");

-- CreateIndex
CREATE INDEX "Vaga_localizacaoId_idx" ON "Vaga"."Vaga"("localizacaoId");

-- CreateIndex
CREATE INDEX "Vaga_clienteId_idx" ON "Vaga"."Vaga"("clienteId");

-- CreateIndex
CREATE INDEX "VagaHabilidade_habilidadeId_idx" ON "VagaHabilidade"."VagaHabilidade"("habilidadeId");

-- CreateIndex
CREATE INDEX "CandidaturaVaga_vagaId_idx" ON "CandidaturaVaga"."CandidaturaVaga"("vagaId");

-- CreateIndex
CREATE INDEX "CandidaturaVaga_processoSeletivoEtapaId_idx" ON "CandidaturaVaga"."CandidaturaVaga"("processoSeletivoEtapaId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidaturaVaga_candidatoId_vagaId_key" ON "CandidaturaVaga"."CandidaturaVaga"("candidatoId", "vagaId");

-- CreateIndex
CREATE INDEX "VagaAnexo_anexoId_idx" ON "VagaAnexo"."VagaAnexo"("anexoId");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficio_nome_key" ON "Beneficio"."Beneficio"("nome");

-- CreateIndex
CREATE INDEX "VagaBeneficio_beneficioId_idx" ON "VagaBeneficio"."VagaBeneficio"("beneficioId");

-- CreateIndex
CREATE UNIQUE INDEX "Habilidade_nome_key" ON "Habilidade"."Habilidade"("nome");
