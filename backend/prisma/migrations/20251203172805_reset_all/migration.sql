-- CreateEnum
CREATE TYPE "CategoriaVaga" AS ENUM ('TECNOLOGIA', 'SAUDE', 'ADMINISTRATIVO', 'FINANCEIRO', 'RECURSOS_HUMANOS', 'MARKETING', 'VENDAS', 'OUTROS');

-- CreateEnum
CREATE TYPE "StatusVaga" AS ENUM ('ALINHAMENTO', 'ABERTA', 'DIVULGACAO', 'TRIAGEM_DE_CURRICULO', 'CONCUIDA', 'GARANTIA', 'PAUSADA', 'ENCERRADA', 'ARQUIVADA');

-- CreateEnum
CREATE TYPE "TipoContrato" AS ENUM ('CLT', 'PJ', 'ESTAGIO', 'FREELANCER', 'TEMPORARIO');

-- CreateEnum
CREATE TYPE "NivelExperiencia" AS ENUM ('ESTAGIO', 'JUNIOR', 'PLENO', 'SENIOR', 'ESPECIALISTA', 'GERENTE');

-- CreateEnum
CREATE TYPE "TipoEtapa" AS ENUM ('APLICACAO', 'TRIAGEM', 'TESTE', 'ENTREVISTA', 'OFERTA', 'CONTRATACAO');

-- CreateEnum
CREATE TYPE "StatusCandidatura" AS ENUM ('APLICADO', 'EM_ANALISE', 'ENTREVISTA_AGENDADA', 'ENTREVISTA_CONCLUIDA', 'OFERTA_ENVIADA', 'OFERTA_ACEITA', 'OFERTA_RECUSADA', 'DESCLASSIFICADO', 'CONTRATADO');

-- CreateEnum
CREATE TYPE "TipoServico" AS ENUM ('RECRUTAMENTO_CONTRATUAL', 'RECRUTAMENTO_DISPARO_CURRICULO', 'RECRUTAMENTO_INFORMACAO', 'PLATAFORMA');

-- CreateEnum
CREATE TYPE "AreaCandidato" AS ENUM ('MEDICINA', 'ENFERMAGEM', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusCliente" AS ENUM ('PROSPECT', 'LEAD', 'ATIVO', 'INATIVO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "TipoEventoAgenda" AS ENUM ('TRIAGEM_INICIAL', 'ENTREVISTA_RH', 'ENTREVISTA_GESTOR', 'TESTE_TECNICO', 'TESTE_PSICOLOGICO', 'DINAMICA_GRUPO', 'PROPOSTA', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoEventoTriagem" AS ENUM ('TRIAGEM_INICIAL', 'ENTREVISTA_RH', 'ENTREVISTA_GESTOR', 'TESTE_TECNICO', 'TESTE_PSICOLOGICO', 'DINAMICA_GRUPO', 'PROPOSTA', 'OUTRO');

-- CreateEnum
CREATE TYPE "Moeda" AS ENUM ('BRL', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "PeriodicidadeSalario" AS ENUM ('HORA', 'DIA', 'MES', 'ANO');

-- CreateEnum
CREATE TYPE "TipoSocio" AS ENUM ('REPRESENTANTE', 'SOCIO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'SEPARADO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ADMIN_SISTEMA', 'ADMINISTRATIVO', 'MODERADOR', 'RECRUTADOR', 'VENDEDOR', 'CLIENTE_ATS', 'CLIENTE_ATS_CRM', 'CLIENTE_CRM', 'CLIENTE');

-- CreateEnum
CREATE TYPE "TipoPessoa" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "LocalEvento" AS ENUM ('REMOTO', 'PRESENCIAL', 'HIBRIDO');

-- CreateEnum
CREATE TYPE "AssinaturaStatus" AS ENUM ('ATIVA', 'EXPIRADA', 'CANCELADA', 'PENDENTE');

-- CreateEnum
CREATE TYPE "TipoPlano" AS ENUM ('MENSAL', 'POR_USO', 'PERSONALIZADO', 'POR_VAGA', 'PERCENTUAL');

-- CreateEnum
CREATE TYPE "CategoriaPlano" AS ENUM ('PLATAFORMA', 'RECRUTAMENTO_COM_RQE', 'RECRUTAMENTO_SEM_RQE', 'RECRUTAMENTO_DIVERSOS');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO');

-- CreateEnum
CREATE TYPE "Signo" AS ENUM ('ARIES', 'TOURO', 'GEMEOS', 'CANCER', 'LEAO', 'VIRGEM', 'LIBRA', 'ESCORPIAO', 'SAGITARIO', 'CAPRICORNIO', 'AQUARIO', 'PEIXES');

-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL DEFAULT 'Titulo',
    "dataHora" TIMESTAMP(3) NOT NULL,
    "link" TEXT,
    "tipoEvento" "TipoEventoAgenda" NOT NULL DEFAULT 'TRIAGEM_INICIAL',
    "localEvento" "LocalEvento" NOT NULL DEFAULT 'REMOTO',
    "convidados" TEXT[],
    "etapaAtualId" TEXT,
    "localizacaoId" TEXT,
    "vagaId" TEXT,
    "clienteId" TEXT,
    "triagemId" TEXT,
    "usuarioSistemaId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessoSeletivoEtapa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoEtapa" NOT NULL,
    "ordem" INTEGER NOT NULL,
    "descricao" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProcessoSeletivoEtapa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaCandidatura" (
    "id" TEXT NOT NULL,
    "agendaId" TEXT NOT NULL,
    "candidaturaId" TEXT NOT NULL,

    CONSTRAINT "AgendaCandidatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidato" (
    "id" TEXT NOT NULL,
    "corem" TEXT,
    "contatos" TEXT[],
    "emails" TEXT[],
    "links" TEXT[],
    "areaCandidato" "AreaCandidato" NOT NULL,
    "pessoaId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crm" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "ufCrm" TEXT NOT NULL,
    "dataInscricao" TIMESTAMP(3) NOT NULL,
    "medicoId" TEXT,

    CONSTRAINT "Crm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medico" (
    "id" TEXT NOT NULL,
    "rqe" TEXT,
    "quadroSocietario" BOOLEAN,
    "quadroDeObservações" TEXT,
    "exames" TEXT,
    "especialidadesEnfermidades" TEXT,
    "porcentagemRepasseMedico" TEXT,
    "porcentagemConsultas" TEXT,
    "porcentagemExames" TEXT,
    "candidatoId" TEXT,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EspecialidadeMedico" (
    "id" TEXT NOT NULL,
    "rqe" TEXT NOT NULL,
    "especialidadeId" INTEGER NOT NULL,
    "medicoId" TEXT NOT NULL,

    CONSTRAINT "EspecialidadeMedico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especialidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formacao" (
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
CREATE TABLE "CandidatoAnexo" (
    "candidatoId" TEXT NOT NULL,
    "anexoId" TEXT NOT NULL,

    CONSTRAINT "CandidatoAnexo_pkey" PRIMARY KEY ("candidatoId","anexoId")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "status" "StatusCliente" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "emails" TEXT[],
    "telefones" TEXT[],

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contato" (
    "id" TEXT NOT NULL,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,

    CONSTRAINT "Contato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
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
CREATE TABLE "Socio" (
    "id" TEXT NOT NULL,
    "tipoSocio" "TipoSocio" NOT NULL,
    "empresaId" TEXT NOT NULL,
    "pessoaId" TEXT NOT NULL,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" TEXT NOT NULL,
    "setor" VARCHAR(100),
    "cargo" VARCHAR(100),
    "pessoaId" TEXT,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localizacao" (
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
CREATE TABLE "Pessoa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "rg" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estadoCivil" "EstadoCivil",
    "sexo" "Sexo",
    "signo" "Signo",
    "empresaRepresentadaId" TEXT,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "tipo" "TipoPlano" NOT NULL DEFAULT 'MENSAL',
    "diasGarantia" INTEGER,
    "limiteUso" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoria" "CategoriaPlano",

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanoAssinado" (
    "id" TEXT NOT NULL,
    "status" "AssinaturaStatus" NOT NULL DEFAULT 'ATIVA',
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
CREATE TABLE "PlanoUso" (
    "id" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dataUso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planoAssinaturaId" TEXT NOT NULL,

    CONSTRAINT "PlanoUso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessao" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usuarioSistemaId" TEXT NOT NULL,

    CONSTRAINT "sessao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefas" (
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
CREATE TABLE "TriagemVaga" (
    "id" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "tipoTriagem" "TipoEventoTriagem" NOT NULL DEFAULT 'TRIAGEM_INICIAL',
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "TriagemVaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioSistema" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipoUsuario" "TipoUsuario" NOT NULL,
    "funcionarioId" TEXT,
    "clienteId" TEXT,

    CONSTRAINT "UsuarioSistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaga" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "requisitos" TEXT,
    "responsabilidades" TEXT,
    "dataPublicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFechamento" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "categoria" "CategoriaVaga" NOT NULL,
    "status" "StatusVaga" NOT NULL,
    "tipoContrato" "TipoContrato",
    "nivelExperiencia" "NivelExperiencia",
    "areaCandidato" "AreaCandidato",
    "salario" DECIMAL(12,2),
    "moeda" "Moeda",
    "tipoSalario" TEXT,
    "periodicidade" "PeriodicidadeSalario",
    "clienteId" TEXT,
    "localizacaoId" TEXT,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VagaHabilidade" (
    "nivelExigido" TEXT,
    "habilidadeId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "VagaHabilidade_pkey" PRIMARY KEY ("vagaId","habilidadeId")
);

-- CreateTable
CREATE TABLE "CandidaturaVaga" (
    "id" TEXT NOT NULL,
    "status" "StatusCandidatura" NOT NULL DEFAULT 'APLICADO',
    "dataAplicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "candidatoId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,
    "processoSeletivoEtapaId" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CandidaturaVaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anexo" (
    "id" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT,
    "tamanhoKb" INTEGER,

    CONSTRAINT "Anexo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VagaAnexo" (
    "anexoId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "VagaAnexo_pkey" PRIMARY KEY ("vagaId","anexoId")
);

-- CreateTable
CREATE TABLE "Beneficio" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Beneficio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VagaBeneficio" (
    "beneficioId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,

    CONSTRAINT "VagaBeneficio_pkey" PRIMARY KEY ("vagaId","beneficioId")
);

-- CreateTable
CREATE TABLE "Habilidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoHabilidade" TEXT,

    CONSTRAINT "Habilidade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Agenda_etapaAtualId_idx" ON "Agenda"("etapaAtualId");

-- CreateIndex
CREATE INDEX "Agenda_localizacaoId_idx" ON "Agenda"("localizacaoId");

-- CreateIndex
CREATE INDEX "Agenda_vagaId_idx" ON "Agenda"("vagaId");

-- CreateIndex
CREATE INDEX "Agenda_clienteId_idx" ON "Agenda"("clienteId");

-- CreateIndex
CREATE INDEX "Agenda_triagemId_idx" ON "Agenda"("triagemId");

-- CreateIndex
CREATE INDEX "Agenda_usuarioSistemaId_idx" ON "Agenda"("usuarioSistemaId");

-- CreateIndex
CREATE INDEX "AgendaCandidatura_agendaId_idx" ON "AgendaCandidatura"("agendaId");

-- CreateIndex
CREATE INDEX "AgendaCandidatura_candidaturaId_idx" ON "AgendaCandidatura"("candidaturaId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_pessoaId_key" ON "Candidato"("pessoaId");

-- CreateIndex
CREATE INDEX "Crm_medicoId_idx" ON "Crm"("medicoId");

-- CreateIndex
CREATE UNIQUE INDEX "Medico_candidatoId_key" ON "Medico"("candidatoId");

-- CreateIndex
CREATE INDEX "Medico_candidatoId_idx" ON "Medico"("candidatoId");

-- CreateIndex
CREATE INDEX "EspecialidadeMedico_especialidadeId_idx" ON "EspecialidadeMedico"("especialidadeId");

-- CreateIndex
CREATE INDEX "EspecialidadeMedico_medicoId_idx" ON "EspecialidadeMedico"("medicoId");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_nome_key" ON "Especialidade"("nome");

-- CreateIndex
CREATE INDEX "Formacao_candidatoId_idx" ON "Formacao"("candidatoId");

-- CreateIndex
CREATE INDEX "CandidatoAnexo_anexoId_idx" ON "CandidatoAnexo"("anexoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_empresaId_key" ON "Cliente"("empresaId");

-- CreateIndex
CREATE INDEX "Cliente_empresaId_idx" ON "Cliente"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_pessoaId_key" ON "Socio"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_empresaId_key" ON "Socio"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_pessoaId_key" ON "Funcionario"("pessoaId");

-- CreateIndex
CREATE INDEX "Funcionario_pessoaId_idx" ON "Funcionario"("pessoaId");

-- CreateIndex
CREATE INDEX "Localizacao_pessoaId_idx" ON "Localizacao"("pessoaId");

-- CreateIndex
CREATE INDEX "Localizacao_empresaId_idx" ON "Localizacao"("empresaId");

-- CreateIndex
CREATE INDEX "Pessoa_empresaRepresentadaId_idx" ON "Pessoa"("empresaRepresentadaId");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_cpf_key" ON "Pessoa"("cpf");

-- CreateIndex
CREATE INDEX "PlanoAssinado_clienteId_idx" ON "PlanoAssinado"("clienteId");

-- CreateIndex
CREATE INDEX "PlanoAssinado_planoId_idx" ON "PlanoAssinado"("planoId");

-- CreateIndex
CREATE INDEX "PlanoUso_planoAssinaturaId_idx" ON "PlanoUso"("planoAssinaturaId");

-- CreateIndex
CREATE UNIQUE INDEX "sessao_token_key" ON "sessao"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessao_usuarioSistemaId_key" ON "sessao"("usuarioSistemaId");

-- CreateIndex
CREATE INDEX "sessao_usuarioSistemaId_idx" ON "sessao"("usuarioSistemaId");

-- CreateIndex
CREATE INDEX "tarefas_idUsuarioSistema_idx" ON "tarefas"("idUsuarioSistema");

-- CreateIndex
CREATE INDEX "TriagemVaga_vagaId_idx" ON "TriagemVaga"("vagaId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_funcionarioId_key" ON "UsuarioSistema"("funcionarioId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_clienteId_key" ON "UsuarioSistema"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_email_key" ON "UsuarioSistema"("email");

-- CreateIndex
CREATE INDEX "Vaga_localizacaoId_idx" ON "Vaga"("localizacaoId");

-- CreateIndex
CREATE INDEX "Vaga_clienteId_idx" ON "Vaga"("clienteId");

-- CreateIndex
CREATE INDEX "VagaHabilidade_habilidadeId_idx" ON "VagaHabilidade"("habilidadeId");

-- CreateIndex
CREATE INDEX "CandidaturaVaga_vagaId_idx" ON "CandidaturaVaga"("vagaId");

-- CreateIndex
CREATE INDEX "CandidaturaVaga_processoSeletivoEtapaId_idx" ON "CandidaturaVaga"("processoSeletivoEtapaId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidaturaVaga_candidatoId_vagaId_key" ON "CandidaturaVaga"("candidatoId", "vagaId");

-- CreateIndex
CREATE INDEX "VagaAnexo_anexoId_idx" ON "VagaAnexo"("anexoId");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficio_nome_key" ON "Beneficio"("nome");

-- CreateIndex
CREATE INDEX "VagaBeneficio_beneficioId_idx" ON "VagaBeneficio"("beneficioId");

-- CreateIndex
CREATE UNIQUE INDEX "Habilidade_nome_key" ON "Habilidade"("nome");

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_etapaAtualId_fkey" FOREIGN KEY ("etapaAtualId") REFERENCES "ProcessoSeletivoEtapa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "Localizacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_triagemId_fkey" FOREIGN KEY ("triagemId") REFERENCES "TriagemVaga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_usuarioSistemaId_fkey" FOREIGN KEY ("usuarioSistemaId") REFERENCES "UsuarioSistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaCandidatura" ADD CONSTRAINT "AgendaCandidatura_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaCandidatura" ADD CONSTRAINT "AgendaCandidatura_candidaturaId_fkey" FOREIGN KEY ("candidaturaId") REFERENCES "CandidaturaVaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crm" ADD CONSTRAINT "Crm_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medico" ADD CONSTRAINT "Medico_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EspecialidadeMedico" ADD CONSTRAINT "EspecialidadeMedico_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EspecialidadeMedico" ADD CONSTRAINT "EspecialidadeMedico_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formacao" ADD CONSTRAINT "Formacao_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoAnexo" ADD CONSTRAINT "CandidatoAnexo_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatoAnexo" ADD CONSTRAINT "CandidatoAnexo_anexoId_fkey" FOREIGN KEY ("anexoId") REFERENCES "Anexo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localizacao" ADD CONSTRAINT "Localizacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localizacao" ADD CONSTRAINT "Localizacao_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_empresaRepresentadaId_fkey" FOREIGN KEY ("empresaRepresentadaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoAssinado" ADD CONSTRAINT "PlanoAssinado_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoAssinado" ADD CONSTRAINT "PlanoAssinado_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoUso" ADD CONSTRAINT "PlanoUso_planoAssinaturaId_fkey" FOREIGN KEY ("planoAssinaturaId") REFERENCES "PlanoAssinado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessao" ADD CONSTRAINT "sessao_usuarioSistemaId_fkey" FOREIGN KEY ("usuarioSistemaId") REFERENCES "UsuarioSistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_idUsuarioSistema_fkey" FOREIGN KEY ("idUsuarioSistema") REFERENCES "UsuarioSistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriagemVaga" ADD CONSTRAINT "TriagemVaga_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioSistema" ADD CONSTRAINT "UsuarioSistema_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioSistema" ADD CONSTRAINT "UsuarioSistema_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "Localizacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaHabilidade" ADD CONSTRAINT "VagaHabilidade_habilidadeId_fkey" FOREIGN KEY ("habilidadeId") REFERENCES "Habilidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaHabilidade" ADD CONSTRAINT "VagaHabilidade_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidaturaVaga" ADD CONSTRAINT "CandidaturaVaga_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidaturaVaga" ADD CONSTRAINT "CandidaturaVaga_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidaturaVaga" ADD CONSTRAINT "CandidaturaVaga_processoSeletivoEtapaId_fkey" FOREIGN KEY ("processoSeletivoEtapaId") REFERENCES "ProcessoSeletivoEtapa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaAnexo" ADD CONSTRAINT "VagaAnexo_anexoId_fkey" FOREIGN KEY ("anexoId") REFERENCES "Anexo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaAnexo" ADD CONSTRAINT "VagaAnexo_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaBeneficio" ADD CONSTRAINT "VagaBeneficio_beneficioId_fkey" FOREIGN KEY ("beneficioId") REFERENCES "Beneficio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VagaBeneficio" ADD CONSTRAINT "VagaBeneficio_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
