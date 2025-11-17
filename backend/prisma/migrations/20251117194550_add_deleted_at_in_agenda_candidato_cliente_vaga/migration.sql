-- AlterTable
ALTER TABLE "Agenda"."Agenda" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Candidato"."Candidato" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CandidaturaVaga"."CandidaturaVaga" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Cliente"."Cliente" ADD COLUMN     "deletedAt" TIMESTAMP(3);
