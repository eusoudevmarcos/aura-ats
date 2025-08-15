/*
  Warnings:

  - You are about to drop the column `instituição` on the `Formacao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Formacao" DROP COLUMN "instituição",
ADD COLUMN     "instituicao" TEXT DEFAULT 'A definir';
