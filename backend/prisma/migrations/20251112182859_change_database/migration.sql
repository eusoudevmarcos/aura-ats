-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Agenda";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "AgendaCandidatura";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Anexo";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Beneficio";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Candidato";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "CandidaturaVaga";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Cliente";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Contato";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Empresa";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Especialidade";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Formacao";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Funcionario";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Habilidade";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Localizacao";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Pessoa";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Plano";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "ProcessoSeletivoEtapa";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Sessao";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Socio";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Tarefa";

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

-- CreateEnum (condicional)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'categoriavaga') THEN
        CREATE TYPE "public"."CategoriaVaga" AS ENUM ('TECNOLOGIA', 'SAUDE', 'ADMINISTRATIVO', 'FINANCEIRO', 'RECURSOS_HUMANOS', 'MARKETING', 'VENDAS', 'OUTROS');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statusvaga') THEN
        CREATE TYPE "public"."StatusVaga" AS ENUM ('ATIVA', 'PAUSADA', 'ENCERRADA', 'ARQUIVADA');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipocontrato') THEN
        CREATE TYPE "public"."TipoContrato" AS ENUM ('CLT', 'PJ', 'ESTAGIO', 'FREELANCER', 'TEMPORARIO');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nivelexperiencia') THEN
        CREATE TYPE "public"."NivelExperiencia" AS ENUM ('ESTAGIO', 'JUNIOR', 'PLENO', 'SENIOR', 'ESPECIALISTA', 'GERENTE');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipoetapa') THEN
        CREATE TYPE "public"."TipoEtapa" AS ENUM ('APLICACAO', 'TRIAGEM', 'TESTE', 'ENTREVISTA', 'OFERTA', 'CONTRATACAO');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statuscandidatura') THEN
        CREATE TYPE "public"."StatusCandidatura" AS ENUM ('APLICADO', 'EM_ANALISE', 'ENTREVISTA_AGENDADA', 'ENTREVISTA_CONCLUIDA', 'OFERTA_ENVIADA', 'OFERTA_ACEITA', 'OFERTA_RECUSADA', 'DESCLASSIFICADO', 'CONTRATADO');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tiposervico') THEN
        CREATE TYPE "public"."TipoServico" AS ENUM ('RECRUTAMENTO_CONTRATUAL', 'RECRUTAMENTO_DISPARO_CURRICULO', 'RECRUTAMENTO_INFORMACAO', 'PLATAFORMA');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'areacandidato') THEN
        CREATE TYPE "public"."AreaCandidato" AS ENUM ('MEDICINA', 'ENFERMAGEM', 'OUTRO');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statuscliente') THEN
        CREATE TYPE "public"."StatusCliente" AS ENUM ('PROSPECT', 'LEAD', 'ATIVO', 'INATIVO', 'PENDENTE');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipoeventoagenda') THEN
        CREATE TYPE "public"."TipoEventoAgenda" AS ENUM ('TRIAGEM_INICIAL', 'ENTREVISTA_RH', 'ENTREVISTA_GESTOR', 'TESTE_TECNICO', 'TESTE_PSICOLOGICO', 'DINAMICA_GRUPO', 'PROPOSTA', 'OUTRO');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipoeventotriagem') THEN
        CREATE TYPE "public"."TipoEventoTriagem" AS ENUM ('TRIAGEM_INICIAL', 'ENTREVISTA_RH', 'ENTREVISTA_GESTOR', 'TESTE_TECNICO', 'TESTE_PSICOLOGICO', 'DINAMICA_GRUPO', 'PROPOSTA', 'OUTRO');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'moeda') THEN
        CREATE TYPE "public"."Moeda" AS ENUM ('BRL', 'USD', 'EUR');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'periodicidadesalario') THEN
        CREATE TYPE "public"."PeriodicidadeSalario" AS ENUM ('HORA', 'DIA', 'MES', 'ANO');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tiposocio') THEN
        CREATE TYPE "public"."TipoSocio" AS ENUM ('REPRESENTANTE', 'SOCIO', 'ADMINISTRADOR');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estadocivil') THEN
        CREATE TYPE "public"."EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'SEPARADO', 'UNIAO_ESTAVEL');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipousuario') THEN
        CREATE TYPE "public"."TipoUsuario" AS ENUM ('ADMIN_SISTEMA', 'ADMINISTRATIVO', 'MODERADOR', 'RECRUTADOR', 'VENDEDOR', 'CLIENTE_ATS', 'CLIENTE_ATS_CRM', 'CLIENTE_CRM', 'CLIENTE');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipopessoa') THEN
        CREATE TYPE "public"."TipoPessoa" AS ENUM ('FISICA', 'JURIDICA');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'localevento') THEN
        CREATE TYPE "public"."LocalEvento" AS ENUM ('REMOTO', 'PRESENCIAL', 'HIBRIDO');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assinaturastatus') THEN
        CREATE TYPE "public"."AssinaturaStatus" AS ENUM ('ATIVA', 'EXPIRADA', 'CANCELADA', 'PENDENTE');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipoplano') THEN
        CREATE TYPE "public"."TipoPlano" AS ENUM ('MENSAL', 'POR_USO', 'PERSONALIZADO', 'POR_VAGA', 'PERCENTUAL');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'categoriaplano') THEN
        CREATE TYPE "public"."CategoriaPlano" AS ENUM ('PLATAFORMA', 'RECRUTAMENTO_COM_RQE', 'RECRUTAMENTO_SEM_RQE', 'RECRUTAMENTO_DIVERSOS');
    END IF;
END$$;


-- CreateTable (condicional)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Agenda' AND table_name = 'Agenda') THEN
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
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'ProcessoSeletivoEtapa' AND table_name = 'ProcessoSeletivoEtapa') THEN
CREATE TABLE "ProcessoSeletivoEtapa"."ProcessoSeletivoEtapa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "public"."TipoEtapa" NOT NULL,
    "ordem" INTEGER NOT NULL,
    "descricao" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProcessoSeletivoEtapa_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'AgendaCandidatura' AND table_name = 'AgendaCandidatura') THEN
CREATE TABLE "AgendaCandidatura"."AgendaCandidatura" (
    "id" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,
    "candidaturaId" TEXT NOT NULL,

    CONSTRAINT "AgendaCandidatura_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Candidato' AND table_name = 'Candidato') THEN
CREATE TABLE "Candidato"."Candidato" (
    "id" TEXT NOT NULL,
    "corem" TEXT,
    "rqe" TEXT,
    "crm" TEXT[],
    "contatos" TEXT[],
    "emails" TEXT[],
    "areaCandidato" "public"."AreaCandidato" NOT NULL,
    "especialidadeId" INTEGER,
    "pessoaId" TEXT NOT NULL,

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Especialidade' AND table_name = 'Especialidade') THEN
CREATE TABLE "Especialidade"."Especialidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Formacao' AND table_name = 'Formacao') THEN
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
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Cliente' AND table_name = 'Cliente') THEN
CREATE TABLE "Cliente"."Cliente" (
    "id" TEXT NOT NULL,
    "status" "public"."StatusCliente" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Contato' AND table_name = 'Contato') THEN
CREATE TABLE "Contato"."Contato" (
    "id" TEXT NOT NULL,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,

    CONSTRAINT "Contato_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Empresa' AND table_name = 'Empresa') THEN
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
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Socio' AND table_name = 'Socio') THEN
CREATE TABLE "Socio"."Socio" (
    "id" TEXT NOT NULL,
    "tipoSocio" "public"."TipoSocio" NOT NULL,
    "empresaId" TEXT NOT NULL,
    "pessoaId" TEXT NOT NULL,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Funcionario' AND table_name = 'Funcionario') THEN
CREATE TABLE "Funcionario"."Funcionario" (
    "id" TEXT NOT NULL,
    "setor" VARCHAR(100),
    "cargo" VARCHAR(100),
    "pessoaId" TEXT,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Localizacao' AND table_name = 'Localizacao') THEN
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
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Pessoa' AND table_name = 'Pessoa') THEN
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
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Plano' AND table_name = 'Plano') THEN
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
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Plano' AND table_name = 'PlanoAssinado') THEN
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
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Plano' AND table_name = 'PlanoUso') THEN
CREATE TABLE "Plano"."PlanoUso" (
    "id" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dataUso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planoAssinaturaId" TEXT NOT NULL,

    CONSTRAINT "PlanoUso_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Sessao' AND table_name = 'sessao') THEN
CREATE TABLE "Sessao"."sessao" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usuarioSistemaId" TEXT NOT NULL,

    CONSTRAINT "sessao_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Tarefa' AND table_name = 'tarefas') THEN
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
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'TriagemVaga' AND table_name = 'TriagemVaga') THEN
CREATE TABLE "TriagemVaga"."TriagemVaga" (
    "id" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "tipoTriagem" "public"."TipoEventoTriagem" NOT NULL DEFAULT 'TRIAGEM_INICIAL',
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "TriagemVaga_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'UsuarioSistema' AND table_name = 'UsuarioSistema') THEN
CREATE TABLE "UsuarioSistema"."UsuarioSistema" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipoUsuario" "public"."TipoUsuario" NOT NULL,
    "funcionarioId" TEXT,
    "clienteId" TEXT,

    CONSTRAINT "UsuarioSistema_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Vaga' AND table_name = 'Vaga') THEN
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
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'VagaHabilidade' AND table_name = 'VagaHabilidade') THEN
CREATE TABLE "VagaHabilidade"."VagaHabilidade" (
    "nivelExigido" TEXT,
    "habilidadeId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "VagaHabilidade_pkey" PRIMARY KEY ("vagaId","habilidadeId")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'CandidaturaVaga' AND table_name = 'CandidaturaVaga') THEN
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
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Anexo' AND table_name = 'Anexo') THEN
CREATE TABLE "Anexo"."Anexo" (
    "id" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT,
    "tamanhoKb" INTEGER,

    CONSTRAINT "Anexo_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'VagaAnexo' AND table_name = 'VagaAnexo') THEN
CREATE TABLE "VagaAnexo"."VagaAnexo" (
    "anexoId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "VagaAnexo_pkey" PRIMARY KEY ("vagaId","anexoId")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Beneficio' AND table_name = 'Beneficio') THEN
CREATE TABLE "Beneficio"."Beneficio" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Beneficio_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'VagaBeneficio' AND table_name = 'VagaBeneficio') THEN
CREATE TABLE "VagaBeneficio"."VagaBeneficio" (
    "beneficioId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "VagaBeneficio_pkey" PRIMARY KEY ("vagaId","beneficioId")
);
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'Habilidade' AND table_name = 'Habilidade') THEN
CREATE TABLE "Habilidade"."Habilidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoHabilidade" TEXT,

    CONSTRAINT "Habilidade_pkey" PRIMARY KEY ("id")
);
    END IF;
END$$;


-- CreateIndex (condicional)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Agenda' AND indexname = 'Agenda_etapaAtualId_idx') THEN
        CREATE INDEX "Agenda_etapaAtualId_idx" ON "Agenda"."Agenda"("etapaAtualId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Agenda' AND indexname = 'Agenda_localizacaoId_idx') THEN
        CREATE INDEX "Agenda_localizacaoId_idx" ON "Agenda"."Agenda"("localizacaoId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Agenda' AND indexname = 'Agenda_vagaId_idx') THEN
        CREATE INDEX "Agenda_vagaId_idx" ON "Agenda"."Agenda"("vagaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Agenda' AND indexname = 'Agenda_clienteId_idx') THEN
        CREATE INDEX "Agenda_clienteId_idx" ON "Agenda"."Agenda"("clienteId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Agenda' AND indexname = 'Agenda_triagemId_idx') THEN
        CREATE INDEX "Agenda_triagemId_idx" ON "Agenda"."Agenda"("triagemId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Agenda' AND indexname = 'Agenda_usuarioSistemaId_idx') THEN
        CREATE INDEX "Agenda_usuarioSistemaId_idx" ON "Agenda"."Agenda"("usuarioSistemaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'AgendaCandidatura' AND indexname = 'AgendaCandidatura_agendaId_idx') THEN
        CREATE INDEX "AgendaCandidatura_agendaId_idx" ON "AgendaCandidatura"."AgendaCandidatura"("agendaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'AgendaCandidatura' AND indexname = 'AgendaCandidatura_candidaturaId_idx') THEN
        CREATE INDEX "AgendaCandidatura_candidaturaId_idx" ON "AgendaCandidatura"."AgendaCandidatura"("candidaturaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Candidato' AND indexname = 'Candidato_pessoaId_key') THEN
        CREATE UNIQUE INDEX "Candidato_pessoaId_key" ON "Candidato"."Candidato"("pessoaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Candidato' AND indexname = 'Candidato_especialidadeId_idx') THEN
        CREATE INDEX "Candidato_especialidadeId_idx" ON "Candidato"."Candidato"("especialidadeId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Especialidade' AND indexname = 'Especialidade_nome_key') THEN
        CREATE UNIQUE INDEX "Especialidade_nome_key" ON "Especialidade"."Especialidade"("nome");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Formacao' AND indexname = 'Formacao_candidatoId_idx') THEN
        CREATE INDEX "Formacao_candidatoId_idx" ON "Formacao"."Formacao"("candidatoId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Cliente' AND indexname = 'Cliente_empresaId_key') THEN
        CREATE UNIQUE INDEX "Cliente_empresaId_key" ON "Cliente"."Cliente"("empresaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Cliente' AND indexname = 'Cliente_empresaId_idx') THEN
        CREATE INDEX "Cliente_empresaId_idx" ON "Cliente"."Cliente"("empresaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Empresa' AND indexname = 'Empresa_cnpj_key') THEN
        CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"."Empresa"("cnpj");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Socio' AND indexname = 'Socio_pessoaId_key') THEN
        CREATE UNIQUE INDEX "Socio_pessoaId_key" ON "Socio"."Socio"("pessoaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Socio' AND indexname = 'Socio_empresaId_key') THEN
        CREATE UNIQUE INDEX "Socio_empresaId_key" ON "Socio"."Socio"("empresaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Funcionario' AND indexname = 'Funcionario_pessoaId_key') THEN
        CREATE UNIQUE INDEX "Funcionario_pessoaId_key" ON "Funcionario"."Funcionario"("pessoaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Funcionario' AND indexname = 'Funcionario_pessoaId_idx') THEN
        CREATE INDEX "Funcionario_pessoaId_idx" ON "Funcionario"."Funcionario"("pessoaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Localizacao' AND indexname = 'Localizacao_pessoaId_idx') THEN
        CREATE INDEX "Localizacao_pessoaId_idx" ON "Localizacao"."Localizacao"("pessoaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Localizacao' AND indexname = 'Localizacao_empresaId_idx') THEN
        CREATE INDEX "Localizacao_empresaId_idx" ON "Localizacao"."Localizacao"("empresaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Pessoa' AND indexname = 'Pessoa_empresaRepresentadaId_idx') THEN
        CREATE INDEX "Pessoa_empresaRepresentadaId_idx" ON "Pessoa"."Pessoa"("empresaRepresentadaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Pessoa' AND indexname = 'Pessoa_cpf_key') THEN
        CREATE UNIQUE INDEX "Pessoa_cpf_key" ON "Pessoa"."Pessoa"("cpf");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Plano' AND indexname = 'PlanoAssinado_clienteId_idx') THEN
        CREATE INDEX "PlanoAssinado_clienteId_idx" ON "Plano"."PlanoAssinado"("clienteId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Plano' AND indexname = 'PlanoAssinado_planoId_idx') THEN
        CREATE INDEX "PlanoAssinado_planoId_idx" ON "Plano"."PlanoAssinado"("planoId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Plano' AND indexname = 'PlanoUso_planoAssinaturaId_idx') THEN
        CREATE INDEX "PlanoUso_planoAssinaturaId_idx" ON "Plano"."PlanoUso"("planoAssinaturaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Sessao' AND indexname = 'sessao_token_key') THEN
        CREATE UNIQUE INDEX "sessao_token_key" ON "Sessao"."sessao"("token");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Sessao' AND indexname = 'sessao_usuarioSistemaId_key') THEN
        CREATE UNIQUE INDEX "sessao_usuarioSistemaId_key" ON "Sessao"."sessao"("usuarioSistemaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Sessao' AND indexname = 'sessao_usuarioSistemaId_idx') THEN
        CREATE INDEX "sessao_usuarioSistemaId_idx" ON "Sessao"."sessao"("usuarioSistemaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Tarefa' AND indexname = 'tarefas_idUsuarioSistema_idx') THEN
        CREATE INDEX "tarefas_idUsuarioSistema_idx" ON "Tarefa"."tarefas"("idUsuarioSistema");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'TriagemVaga' AND indexname = 'TriagemVaga_vagaId_idx') THEN
        CREATE INDEX "TriagemVaga_vagaId_idx" ON "TriagemVaga"."TriagemVaga"("vagaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'UsuarioSistema' AND indexname = 'UsuarioSistema_funcionarioId_key') THEN
        CREATE UNIQUE INDEX "UsuarioSistema_funcionarioId_key" ON "UsuarioSistema"."UsuarioSistema"("funcionarioId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'UsuarioSistema' AND indexname = 'UsuarioSistema_clienteId_key') THEN
        CREATE UNIQUE INDEX "UsuarioSistema_clienteId_key" ON "UsuarioSistema"."UsuarioSistema"("clienteId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'UsuarioSistema' AND indexname = 'UsuarioSistema_email_key') THEN
        CREATE UNIQUE INDEX "UsuarioSistema_email_key" ON "UsuarioSistema"."UsuarioSistema"("email");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Vaga' AND indexname = 'Vaga_localizacaoId_idx') THEN
        CREATE INDEX "Vaga_localizacaoId_idx" ON "Vaga"."Vaga"("localizacaoId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Vaga' AND indexname = 'Vaga_clienteId_idx') THEN
        CREATE INDEX "Vaga_clienteId_idx" ON "Vaga"."Vaga"("clienteId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'VagaHabilidade' AND indexname = 'VagaHabilidade_habilidadeId_idx') THEN
        CREATE INDEX "VagaHabilidade_habilidadeId_idx" ON "VagaHabilidade"."VagaHabilidade"("habilidadeId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'CandidaturaVaga' AND indexname = 'CandidaturaVaga_vagaId_idx') THEN
        CREATE INDEX "CandidaturaVaga_vagaId_idx" ON "CandidaturaVaga"."CandidaturaVaga"("vagaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'CandidaturaVaga' AND indexname = 'CandidaturaVaga_processoSeletivoEtapaId_idx') THEN
        CREATE INDEX "CandidaturaVaga_processoSeletivoEtapaId_idx" ON "CandidaturaVaga"."CandidaturaVaga"("processoSeletivoEtapaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'CandidaturaVaga' AND indexname = 'CandidaturaVaga_candidatoId_vagaId_key') THEN
        CREATE UNIQUE INDEX "CandidaturaVaga_candidatoId_vagaId_key" ON "CandidaturaVaga"."CandidaturaVaga"("candidatoId", "vagaId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'VagaAnexo' AND indexname = 'VagaAnexo_anexoId_idx') THEN
        CREATE INDEX "VagaAnexo_anexoId_idx" ON "VagaAnexo"."VagaAnexo"("anexoId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Beneficio' AND indexname = 'Beneficio_nome_key') THEN
        CREATE UNIQUE INDEX "Beneficio_nome_key" ON "Beneficio"."Beneficio"("nome");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'VagaBeneficio' AND indexname = 'VagaBeneficio_beneficioId_idx') THEN
        CREATE INDEX "VagaBeneficio_beneficioId_idx" ON "VagaBeneficio"."VagaBeneficio"("beneficioId");
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'Habilidade' AND indexname = 'Habilidade_nome_key') THEN
        CREATE UNIQUE INDEX "Habilidade_nome_key" ON "Habilidade"."Habilidade"("nome");
    END IF;
END;
$$;

