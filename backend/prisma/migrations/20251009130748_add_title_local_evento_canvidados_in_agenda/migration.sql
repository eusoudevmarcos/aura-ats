-- CreateEnum
CREATE TYPE "public"."LocalEvento" AS ENUM ('REMOTO', 'PRESENCIAL', 'HIBRIDO');

-- AlterTable
ALTER TABLE "Agenda"."Agenda" ADD COLUMN     "convidados" TEXT[],
ADD COLUMN     "localEvento" "public"."LocalEvento" NOT NULL DEFAULT 'REMOTO',
ADD COLUMN     "titulo" TEXT NOT NULL DEFAULT 'Titulo';
