/*
  Warnings:

  - You are about to drop the column `observações` on the `PlanoAssinado` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plano"."PlanoAssinado" DROP COLUMN "observações",
ADD COLUMN     "observacoes" TEXT;
