/*
  Warnings:

  - You are about to drop the column `usuarioSistemaId` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioSistemaId` on the `Funcionario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[funcionarioId]` on the table `UsuarioSistema` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clienteId]` on the table `UsuarioSistema` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clienteId` to the `UsuarioSistema` table without a default value. This is not possible if the table is not empty.
  - Added the required column `funcionarioId` to the `UsuarioSistema` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cliente"."Cliente_usuarioSistemaId_key";

-- DropIndex
DROP INDEX "Funcionario"."Funcionario_usuarioSistemaId_idx";

-- DropIndex
DROP INDEX "Funcionario"."Funcionario_usuarioSistemaId_key";

-- AlterTable
ALTER TABLE "Cliente"."Cliente" DROP COLUMN "usuarioSistemaId";

-- AlterTable
ALTER TABLE "Funcionario"."Funcionario" DROP COLUMN "usuarioSistemaId";

-- AlterTable
ALTER TABLE "UsuarioSistema"."UsuarioSistema" ADD COLUMN     "clienteId" TEXT NOT NULL,
ADD COLUMN     "funcionarioId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_funcionarioId_key" ON "UsuarioSistema"."UsuarioSistema"("funcionarioId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_clienteId_key" ON "UsuarioSistema"."UsuarioSistema"("clienteId");
