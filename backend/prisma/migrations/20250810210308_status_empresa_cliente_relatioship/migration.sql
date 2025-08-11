/*
  Warnings:

  - Added the required column `status` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."StatusCliente" AS ENUM ('ATIVO', 'INATIVO', 'PENDENTE', 'LEAD');

-- AlterTable
ALTER TABLE "public"."Cliente" ADD COLUMN     "status" "public"."StatusCliente" NOT NULL;
