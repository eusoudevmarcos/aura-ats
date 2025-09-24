-- DropForeignKey
ALTER TABLE "Cliente"."Cliente" DROP CONSTRAINT "Cliente_usuarioSistemaId_fkey";

-- DropForeignKey
ALTER TABLE "Funcionario"."Funcionario" DROP CONSTRAINT "Funcionario_usuarioSistemaId_fkey";

-- AlterTable
ALTER TABLE "Cliente"."Cliente" ALTER COLUMN "usuarioSistemaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Funcionario"."Funcionario" ALTER COLUMN "usuarioSistemaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Cliente"."Cliente" ADD CONSTRAINT "Cliente_usuarioSistemaId_fkey" FOREIGN KEY ("usuarioSistemaId") REFERENCES "UsuarioSistema"."UsuarioSistema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funcionario"."Funcionario" ADD CONSTRAINT "Funcionario_usuarioSistemaId_fkey" FOREIGN KEY ("usuarioSistemaId") REFERENCES "UsuarioSistema"."UsuarioSistema"("id") ON DELETE SET NULL ON UPDATE CASCADE;
