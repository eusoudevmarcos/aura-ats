-- DropForeignKey
ALTER TABLE "public"."Vaga" DROP CONSTRAINT "Vaga_clienteId_fkey";

-- AlterTable
ALTER TABLE "public"."Vaga" ALTER COLUMN "clienteId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Vaga" ADD CONSTRAINT "Vaga_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
