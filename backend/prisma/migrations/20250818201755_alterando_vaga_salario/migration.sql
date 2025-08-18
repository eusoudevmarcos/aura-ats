/*
  Warnings:

  - You are about to drop the column `salarioMaximo` on the `Vaga` table. All the data in the column will be lost.
  - You are about to drop the column `salarioMinimo` on the `Vaga` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Vaga" DROP COLUMN "salarioMaximo",
DROP COLUMN "salarioMinimo",
ADD COLUMN     "salario" DOUBLE PRECISION,
ADD COLUMN     "tipoSalario" TEXT;
