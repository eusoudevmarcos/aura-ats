/*
  Warnings:

  - You are about to drop the column `tipoServico` on the `Cliente` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."TipoUsuario" ADD VALUE 'CLIENTE';

-- AlterTable
ALTER TABLE "Cliente"."Cliente" DROP COLUMN "tipoServico";
