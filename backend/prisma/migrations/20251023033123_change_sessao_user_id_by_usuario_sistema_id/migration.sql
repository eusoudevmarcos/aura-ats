/*
  Warnings:

  - You are about to drop the column `userId` on the `sessao` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioSistemaId]` on the table `sessao` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuarioSistemaId` to the `sessao` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Sessao"."sessao_userId_idx";

-- DropIndex
DROP INDEX "Sessao"."sessao_userId_key";

-- AlterTable
ALTER TABLE "Sessao"."sessao" DROP COLUMN "userId",
ADD COLUMN     "usuarioSistemaId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sessao_usuarioSistemaId_key" ON "Sessao"."sessao"("usuarioSistemaId");

-- CreateIndex
CREATE INDEX "sessao_usuarioSistemaId_idx" ON "Sessao"."sessao"("usuarioSistemaId");
