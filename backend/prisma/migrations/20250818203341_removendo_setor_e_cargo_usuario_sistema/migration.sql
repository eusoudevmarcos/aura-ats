/*
  Warnings:

  - You are about to alter the column `setor` on the `Funcionario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `cargo` on the `Funcionario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `cargo` on the `UsuarioSistema` table. All the data in the column will be lost.
  - You are about to drop the column `setor` on the `UsuarioSistema` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Funcionario" ALTER COLUMN "setor" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "cargo" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "public"."UsuarioSistema" DROP COLUMN "cargo",
DROP COLUMN "setor";
