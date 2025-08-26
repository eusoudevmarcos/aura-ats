-- DropForeignKey
ALTER TABLE "public"."AgendaVaga" DROP CONSTRAINT "AgendaVaga_vagaId_fkey";

-- AlterTable
ALTER TABLE "public"."AgendaVaga" ALTER COLUMN "vagaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Localizacao" ADD COLUMN     "descricao" TEXT;

-- AlterTable
ALTER TABLE "public"."Vaga" ALTER COLUMN "tipoContrato" DROP NOT NULL,
ALTER COLUMN "nivelExperiencia" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AgendaVaga" ADD CONSTRAINT "AgendaVaga_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "public"."Vaga"("id") ON DELETE SET NULL ON UPDATE CASCADE;
