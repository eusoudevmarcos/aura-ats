-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Sessao";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "Tarefa";

-- CreateTable
CREATE TABLE "Sessao"."sessao" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

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

-- CreateIndex
CREATE UNIQUE INDEX "sessao_token_key" ON "Sessao"."sessao"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessao_userId_key" ON "Sessao"."sessao"("userId");

-- CreateIndex
CREATE INDEX "sessao_userId_idx" ON "Sessao"."sessao"("userId");

-- CreateIndex
CREATE INDEX "tarefas_idUsuarioSistema_idx" ON "Tarefa"."tarefas"("idUsuarioSistema");
