-- CreateEnum
CREATE TYPE "public"."TipoPlano" AS ENUM ('MENSAL', 'POR_USO');

-- AlterTable
ALTER TABLE "Plano"."Plano" ADD COLUMN     "limiteUso" INTEGER,
ADD COLUMN     "tipo" "public"."TipoPlano" NOT NULL DEFAULT 'MENSAL';