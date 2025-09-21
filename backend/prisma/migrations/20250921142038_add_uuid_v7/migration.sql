-- AlterTable
ALTER TABLE "public"."AgendaVaga" ADD COLUMN     "clienteId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."AgendaVaga" ADD CONSTRAINT "AgendaVaga_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
