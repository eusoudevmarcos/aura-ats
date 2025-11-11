/*
  Warnings:
  ... (mantemos as warnings originais para contexto, mas o SQL abaixo é a correção)
*/

-- DropIndex (Mantenha)
DROP INDEX "Cliente"."Cliente_usuarioSistemaId_key";
DROP INDEX "Funcionario"."Funcionario_usuarioSistemaId_idx";
DROP INDEX "Funcionario"."Funcionario_usuarioSistemaId_key";

-- AlterTable (Mantenha as remoções de colunas)
ALTER TABLE "Cliente"."Cliente" DROP COLUMN "usuarioSistemaId";
ALTER TABLE "Funcionario"."Funcionario" DROP COLUMN "usuarioSistemaId";

-- AlterTable (Ajuste Crítico: Adicionar como NULL por enquanto)
-- ADICIONADO: Os campos são adicionados como opcionais (NULL) para permitir o deploy em BD com dados.
ALTER TABLE "UsuarioSistema"."UsuarioSistema"
ADD COLUMN "clienteId" TEXT,
ADD COLUMN "funcionarioId" TEXT;

/*
  Etapa Opcional: Se você tinha dados na coluna que foi removida e
  precisa migrar esses IDs para a nova coluna na tabela UsuarioSistema.
  Você precisará de um script de migração de dados (data migration).
  Este passo deve ser feito manualmente se necessário, e depende da sua lógica de negócio.
*/

-- CreateIndex (Mantenha)
-- Estes índices UNIQUE com colunas NULLable permitem múltiplos NULLs (comportamento padrão do PostgreSQL).
CREATE UNIQUE INDEX "UsuarioSistema_funcionarioId_key" ON "UsuarioSistema"."UsuarioSistema"("funcionarioId");
CREATE UNIQUE INDEX "UsuarioSistema_clienteId_key" ON "UsuarioSistema"."UsuarioSistema"("clienteId");