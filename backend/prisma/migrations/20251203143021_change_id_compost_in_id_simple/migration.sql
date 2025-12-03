/*
  Warnings:

  - The primary key for the `EspecialidadeMedico` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "EspecialidadeMedico"."EspecialidadeMedico" DROP CONSTRAINT "EspecialidadeMedico_pkey",
ADD CONSTRAINT "EspecialidadeMedico_pkey" PRIMARY KEY ("id");
