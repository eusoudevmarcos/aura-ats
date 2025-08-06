import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

export const EspecialidadesEnum = [
  { nome: "Alergia e Imunologia", sigla: "AI" },
  { nome: "Anestesiologia", sigla: "ANE" },
  { nome: "Angiologia", sigla: "ANG" },
  { nome: "Cardiologia", sigla: "CAR" },
  { nome: "Cirurgia Cardiovascular", sigla: "CCV" },
  { nome: "Cirurgia da Mão", sigla: "CMA" },
  { nome: "Cirurgia de Cabeça e Pescoço", sigla: "CCP" },
  { nome: "Cirurgia do Aparelho Digestivo", sigla: "CAD" },
  { nome: "Cirurgia Geral", sigla: "CIR" },
  { nome: "Cirurgia Oncológica", sigla: "CO" },
  { nome: "Cirurgia Pediátrica", sigla: "CPD" },
  { nome: "Cirurgia Plástica", sigla: "CPL" },
  { nome: "Cirurgia Torácica", sigla: "CTO" },
  { nome: "Cirurgia Vascular", sigla: "CVS" },
  { nome: "Clínica Médica", sigla: "CLI" },
  { nome: "Dermatologia", sigla: "DER" },
  { nome: "Endocrinologia e Metabologia", sigla: "END" },
  { nome: "Endoscopia", sigla: "EDS" },
  { nome: "Gastroenterologia", sigla: "GAS" },
  { nome: "Genética Médica", sigla: "GEN" },
  { nome: "Geriatria", sigla: "GER" },
  { nome: "Ginecologia e Obstetrícia", sigla: "GO" },
  { nome: "Hematologia e Hemoterapia", sigla: "HEM" },
  { nome: "Homeopatia", sigla: "HOM" },
  { nome: "Infectologia", sigla: "INF" },
  { nome: "Mastologia", sigla: "MAS" },
  { nome: "Medicina de Emergência", sigla: "EME" },
  { nome: "Medicina de Família e Comunidade", sigla: "MFC" },
  { nome: "Medicina do Trabalho", sigla: "TRB" },
  { nome: "Medicina Esportiva", sigla: "ESP" },
  { nome: "Medicina Física e Reabilitação", sigla: "REH" },
  { nome: "Medicina Intensiva", sigla: "UTI" },
  { nome: "Medicina Legal e Perícia Médica", sigla: "LEG" },
  { nome: "Medicina Nuclear", sigla: "NUC" },
  { nome: "Medicina Preventiva e Social", sigla: "PRE" },
  { nome: "Nefrologia", sigla: "NEF" },
  { nome: "Neurocirurgia", sigla: "NCR" },
  { nome: "Neurologia", sigla: "NEU" },
  { nome: "Nutrologia", sigla: "NUT" },
  { nome: "Oftalmologia", sigla: "OFT" },
  { nome: "Oncologia Clínica", sigla: "ONC" },
  { nome: "Ortopedia e Traumatologia", sigla: "ORT" },
  { nome: "Otorrinolaringologia", sigla: "OTR" },
  { nome: "Patologia", sigla: "PAT" },
  { nome: "Patologia Clínica/Medicina Laboratorial", sigla: "LAB" },
  { nome: "Pediatria", sigla: "PED" },
  { nome: "Pneumologia", sigla: "PNE" },
  { nome: "Psiquiatria", sigla: "PSQ" },
  { nome: "Radiologia e Diagnóstico por Imagem", sigla: "RAD" },
  { nome: "Radioterapia", sigla: "RTP" },
  { nome: "Reumatologia", sigla: "REU" },
  { nome: "Urologia", sigla: "URO" },
];

async function main() {
  try {
    console.log(
      "DATABASE_URL no seed:",
      process.env.DATABASE_URL ? "Carregada" : "Não Carregada"
    );

    const results = await prisma.especialidade.createManyAndReturn({
      data: EspecialidadesEnum,
      skipDuplicates: true,
    });
    console.log(
      `✅ Seed concluído! ${results.length} especialidades adicionadas/atualizadas.`
    );
  } catch (error) {
    console.error("❌ Erro durante a operação de seed:", error);
    throw error;
  }
}

main()
  .catch(async (e) => {
    console.error("🔥 Erro fatal no seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Conexão com o Prisma desconectada.");
  });
