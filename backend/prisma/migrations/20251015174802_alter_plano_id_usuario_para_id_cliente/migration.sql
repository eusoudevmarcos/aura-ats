/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Plano` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `PlanoAssinatura` table. All the data in the column will be lost.
  - Added the required column `clienteId` to the `PlanoAssinatura` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PlanoAssinatura"."PlanoAssinatura_usuarioId_idx";

-- AlterTable
ALTER TABLE "Plano"."Plano" DROP COLUMN "clienteId";

-- AlterTable
ALTER TABLE "PlanoAssinatura"."PlanoAssinatura" DROP COLUMN "usuarioId",
ADD COLUMN     "clienteId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "PlanoAssinatura_clienteId_idx" ON "PlanoAssinatura"."PlanoAssinatura"("clienteId");
