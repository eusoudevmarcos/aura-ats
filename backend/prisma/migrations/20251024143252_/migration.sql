/*
  Warnings:

  - The values [RECRUTAMENTO_DIVERSOSO] on the enum `CategoriaPlano` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CategoriaPlano_new" AS ENUM ('PLATAFORMA', 'RECRUTAMENTO_COM_RQE', 'RECRUTAMENTO_SEM_RQE', 'RECRUTAMENTO_DIVERSOS');
ALTER TABLE "Plano"."Plano" ALTER COLUMN "categoria" TYPE "public"."CategoriaPlano_new" USING ("categoria"::text::"public"."CategoriaPlano_new");
ALTER TYPE "public"."CategoriaPlano" RENAME TO "CategoriaPlano_old";
ALTER TYPE "public"."CategoriaPlano_new" RENAME TO "CategoriaPlano";
DROP TYPE "public"."CategoriaPlano_old";
COMMIT;
