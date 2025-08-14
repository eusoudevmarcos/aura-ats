/*
  Warnings:

  - You are about to drop the column `pessoaId` on the `Formacao` table. All the data in the column will be lost.
  - Made the column `pessoaId` on table `Candidato` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Candidato" DROP CONSTRAINT "Candidato_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Formacao" DROP CONSTRAINT "Formacao_pessoaId_fkey";

-- AlterTable
ALTER TABLE "public"."Candidato" ALTER COLUMN "pessoaId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Formacao" DROP COLUMN "pessoaId",
ADD COLUMN     "candidatoId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Candidato" ADD CONSTRAINT "Candidato_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Formacao" ADD CONSTRAINT "Formacao_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "public"."Candidato"("id") ON DELETE SET NULL ON UPDATE CASCADE;
