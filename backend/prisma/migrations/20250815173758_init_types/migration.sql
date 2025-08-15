-- CreateEnum
CREATE TYPE "aura"."AreaCandidato" AS ENUM ('MEDICINA', 'ENFERMAGEM', 'OUTRO');

-- CreateEnum
CREATE TYPE "aura"."TipoServico" AS ENUM ('RECRUTAMENTO_CONTRATUAL', 'RECRUTAMENTO_DISPARO_CURRICULO', 'RECRUTAMENTO_INFORMACAO', 'PLATAFORMA');

-- CreateEnum
CREATE TYPE "aura"."TipoSocio" AS ENUM ('REPRESENTANTE', 'SOCIO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "aura"."StatusCliente" AS ENUM ('PROSPECT', 'LEAD', 'ATIVO', 'INATIVO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "aura"."EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'SEPARADO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "aura"."TipoUsuario" AS ENUM ('ADMIN_SISTEMA', 'ADMINISTRATIVO', 'MODERADOR', 'RECRUTADOR', 'VENDEDOR', 'CLIENTE_ATS', 'CLIENTE_ATS_CRM');

-- CreateEnum
CREATE TYPE "aura"."TipoPessoa" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "aura"."CategoriaVaga" AS ENUM ('TECNOLOGIA', 'SAUDE', 'ADMINISTRATIVO', 'FINANCEIRO', 'RECURSOS_HUMANOS', 'MARKETING', 'VENDAS', 'OUTROS');

-- CreateEnum
CREATE TYPE "aura"."StatusVaga" AS ENUM ('ATIVA', 'PAUSADA', 'ENCERRADA', 'ARQUIVADA');

-- CreateEnum
CREATE TYPE "aura"."TipoContrato" AS ENUM ('CLT', 'PJ', 'ESTAGIO', 'FREELANCER', 'TEMPORARIO');

-- CreateEnum
CREATE TYPE "aura"."NivelExperiencia" AS ENUM ('ESTAGIO', 'JUNIOR', 'PLENO', 'SENIOR', 'ESPECIALISTA', 'GERENTE');

-- CreateEnum
CREATE TYPE "aura"."TipoEtapa" AS ENUM ('APLICACAO', 'TRIAGEM', 'TESTE', 'ENTREVISTA', 'OFERTA', 'CONTRATACAO');

-- CreateEnum
CREATE TYPE "aura"."StatusCandidatura" AS ENUM ('APLICADO', 'EM_ANALISE', 'ENTREVISTA_AGENDADA', 'ENTREVISTA_CONCLUIDA', 'OFERTA_ENVIADA', 'OFERTA_ACEITA', 'OFERTA_RECUSADA', 'DESCLASSIFICADO', 'CONTRATADO');

-- CreateEnum
CREATE TYPE "aura"."TipoEventoAgenda" AS ENUM ('TRIAGEM_INICIAL', 'ENTREVISTA_RH', 'ENTREVISTA_GESTOR', 'TESTE_TECNICO', 'TESTE_PSICOLOGICO', 'DINAMICA_GRUPO', 'PROPOSTA', 'OUTRO');

-- CreateTable
CREATE TABLE "aura"."Especialidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."Candidato" (
    "id" TEXT NOT NULL,
    "crm" TEXT,
    "corem" TEXT,
    "rqe" TEXT,
    "areaCandidato" "aura"."AreaCandidato" NOT NULL,
    "pessoaId" TEXT NOT NULL,
    "especialidadeId" INTEGER,

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."Formacao" (
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
CREATE TABLE "aura"."CandidatoHabilidade" (
    "candidatoId" TEXT NOT NULL,
    "habilidadeId" TEXT NOT NULL,
    "nivel" TEXT,
    "experienciaAnos" INTEGER,

    CONSTRAINT "CandidatoHabilidade_pkey" PRIMARY KEY ("candidatoId","habilidadeId")
);

-- CreateTable
CREATE TABLE "aura"."Cliente" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipoServico" "aura"."TipoServico"[],
    "status" "aura"."StatusCliente" NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."Empresa" (
    "id" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "dataAbertura" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."Socio" (
    "id" TEXT NOT NULL,
    "pessoaId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipoSocio" "aura"."TipoSocio" NOT NULL,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."Habilidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoHabilidade" TEXT,

    CONSTRAINT "Habilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."Contato" (
    "id" TEXT NOT NULL,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "pessoaId" TEXT,
    "empresaId" TEXT,

    CONSTRAINT "Contato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."Localizacao" (
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
CREATE TABLE "aura"."Pessoa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "rg" TEXT,
    "estadoCivil" "aura"."EstadoCivil",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaRepresentadaId" TEXT,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."UsuarioSistema" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipoUsuario" "aura"."TipoUsuario" NOT NULL,
    "setor" TEXT,
    "cargo" TEXT,
    "pessoaId" TEXT,
    "empresaId" TEXT,

    CONSTRAINT "UsuarioSistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."Funcionario" (
    "id" TEXT NOT NULL,
    "setor" TEXT,
    "cargo" TEXT,
    "usuarioSistemaId" TEXT NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."Vaga" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "requisitos" TEXT,
    "responsabilidades" TEXT,
    "salarioMinimo" DOUBLE PRECISION,
    "salarioMaximo" DOUBLE PRECISION,
    "dataPublicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFechamento" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "categoria" "aura"."CategoriaVaga" NOT NULL,
    "status" "aura"."StatusVaga" NOT NULL,
    "tipoContrato" "aura"."TipoContrato" NOT NULL,
    "nivelExperiencia" "aura"."NivelExperiencia" NOT NULL,
    "areaCandidato" "aura"."AreaCandidato",
    "clienteId" TEXT NOT NULL,
    "localizacaoId" TEXT,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."VagaHabilidade" (
    "nivelExigido" TEXT,
    "vagaId" TEXT NOT NULL,
    "habilidadeId" TEXT NOT NULL,

    CONSTRAINT "VagaHabilidade_pkey" PRIMARY KEY ("vagaId","habilidadeId")
);

-- CreateTable
CREATE TABLE "aura"."ProcessoSeletivoEtapa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "aura"."TipoEtapa" NOT NULL,
    "ordem" INTEGER NOT NULL,
    "descricao" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProcessoSeletivoEtapa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."AgendaVaga" (
    "id" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "tipoEvento" "aura"."TipoEventoAgenda" NOT NULL,
    "link" TEXT,
    "vagaId" TEXT NOT NULL,
    "localizacaoId" TEXT,
    "etapaAtualId" TEXT,

    CONSTRAINT "AgendaVaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."CandidaturaVaga" (
    "id" TEXT NOT NULL,
    "candidatoId" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,
    "status" "aura"."StatusCandidatura" NOT NULL DEFAULT 'APLICADO',
    "dataAplicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "etapaAtualId" TEXT,

    CONSTRAINT "CandidaturaVaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."Anexo" (
    "id" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT,
    "tamanhoKb" INTEGER,

    CONSTRAINT "Anexo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."VagaAnexo" (
    "vagaId" TEXT NOT NULL,
    "anexoId" TEXT NOT NULL,

    CONSTRAINT "VagaAnexo_pkey" PRIMARY KEY ("vagaId","anexoId")
);

-- CreateTable
CREATE TABLE "aura"."Beneficio" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "vagaId" TEXT,

    CONSTRAINT "Beneficio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura"."_CandidatoToVaga" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CandidatoToVaga_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_nome_key" ON "aura"."Especialidade"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_pessoaId_key" ON "aura"."Candidato"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_empresaId_key" ON "aura"."Cliente"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "aura"."Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_pessoaId_empresaId_key" ON "aura"."Socio"("pessoaId", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Habilidade_nome_key" ON "aura"."Habilidade"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_cpf_key" ON "aura"."Pessoa"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_email_key" ON "aura"."UsuarioSistema"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_pessoaId_key" ON "aura"."UsuarioSistema"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_empresaId_key" ON "aura"."UsuarioSistema"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_usuarioSistemaId_key" ON "aura"."Funcionario"("usuarioSistemaId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidaturaVaga_candidatoId_vagaId_key" ON "aura"."CandidaturaVaga"("candidatoId", "vagaId");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficio_nome_key" ON "aura"."Beneficio"("nome");

-- CreateIndex
CREATE INDEX "_CandidatoToVaga_B_index" ON "aura"."_CandidatoToVaga"("B");

-- AddForeignKey
ALTER TABLE "aura"."Candidato" ADD CONSTRAINT "Candidato_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "aura"."Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Candidato" ADD CONSTRAINT "Candidato_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "aura"."Especialidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Formacao" ADD CONSTRAINT "Formacao_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "aura"."Candidato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."CandidatoHabilidade" ADD CONSTRAINT "CandidatoHabilidade_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "aura"."Candidato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."CandidatoHabilidade" ADD CONSTRAINT "CandidatoHabilidade_habilidadeId_fkey" FOREIGN KEY ("habilidadeId") REFERENCES "aura"."Habilidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Cliente" ADD CONSTRAINT "Cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "aura"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Socio" ADD CONSTRAINT "Socio_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "aura"."Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Socio" ADD CONSTRAINT "Socio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "aura"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Contato" ADD CONSTRAINT "Contato_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "aura"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Contato" ADD CONSTRAINT "Contato_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "aura"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Localizacao" ADD CONSTRAINT "Localizacao_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "aura"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Localizacao" ADD CONSTRAINT "Localizacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "aura"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Pessoa" ADD CONSTRAINT "Pessoa_empresaRepresentadaId_fkey" FOREIGN KEY ("empresaRepresentadaId") REFERENCES "aura"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."UsuarioSistema" ADD CONSTRAINT "UsuarioSistema_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "aura"."Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."UsuarioSistema" ADD CONSTRAINT "UsuarioSistema_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "aura"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Funcionario" ADD CONSTRAINT "Funcionario_usuarioSistemaId_fkey" FOREIGN KEY ("usuarioSistemaId") REFERENCES "aura"."UsuarioSistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Vaga" ADD CONSTRAINT "Vaga_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "aura"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Vaga" ADD CONSTRAINT "Vaga_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "aura"."Localizacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."VagaHabilidade" ADD CONSTRAINT "VagaHabilidade_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "aura"."Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."VagaHabilidade" ADD CONSTRAINT "VagaHabilidade_habilidadeId_fkey" FOREIGN KEY ("habilidadeId") REFERENCES "aura"."Habilidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."AgendaVaga" ADD CONSTRAINT "AgendaVaga_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "aura"."Localizacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."AgendaVaga" ADD CONSTRAINT "AgendaVaga_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "aura"."Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."AgendaVaga" ADD CONSTRAINT "AgendaVaga_etapaAtualId_fkey" FOREIGN KEY ("etapaAtualId") REFERENCES "aura"."ProcessoSeletivoEtapa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."CandidaturaVaga" ADD CONSTRAINT "CandidaturaVaga_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "aura"."Candidato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."CandidaturaVaga" ADD CONSTRAINT "CandidaturaVaga_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "aura"."Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."CandidaturaVaga" ADD CONSTRAINT "CandidaturaVaga_etapaAtualId_fkey" FOREIGN KEY ("etapaAtualId") REFERENCES "aura"."ProcessoSeletivoEtapa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."VagaAnexo" ADD CONSTRAINT "VagaAnexo_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "aura"."Vaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."VagaAnexo" ADD CONSTRAINT "VagaAnexo_anexoId_fkey" FOREIGN KEY ("anexoId") REFERENCES "aura"."Anexo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."Beneficio" ADD CONSTRAINT "Beneficio_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "aura"."Vaga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."_CandidatoToVaga" ADD CONSTRAINT "_CandidatoToVaga_A_fkey" FOREIGN KEY ("A") REFERENCES "aura"."Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aura"."_CandidatoToVaga" ADD CONSTRAINT "_CandidatoToVaga_B_fkey" FOREIGN KEY ("B") REFERENCES "aura"."Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
