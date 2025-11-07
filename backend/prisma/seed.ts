import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import { BeneficiosSeed } from "./seed/beneficios";
import {
  plataformaSeed,
  recrutamentoComRQESeed,
  recrutamentoDiversosSeed,
  recrutamentoSemRQESeed,
} from "./seed/billings";
import { EspecialidadesSeed } from "./seed/especialidades";

dotenv.config({ path: ".env" });

const prisma = new PrismaClient();

async function upsertEspecialidades() {
  for (const especialidade of EspecialidadesSeed) {
    await prisma.especialidade.upsert({
      where: { nome: especialidade.nome },
      update: { ...especialidade },
      create: { ...especialidade },
    });
  }
  console.log(
    `✅ ${EspecialidadesSeed.length} especialidades adicionadas/atualizadas.`
  );
}

async function upsertBeneficios() {
  for (const beneficio of BeneficiosSeed) {
    await prisma.beneficio.upsert({
      where: { nome: beneficio.nome },
      update: { ...beneficio },
      create: { ...beneficio },
    });
  }
  console.log(
    `✅ ${BeneficiosSeed.length} benefícios adicionados/atualizados.`
  );
}

// Função para upsert dos planos usando findUnique + updateOrCreate por causa do constraint.
async function createPlanos(planoList: any[], tipoDesc: string) {
  await prisma.plano.deleteMany();
  for (const plano of planoList) {
    await prisma.plano.createMany({
      data: {
        nome: plano.nome,
        descricao: plano.descricao,
        preco: plano.preco,
        diasGarantia: plano.diasGarantia,
        ativo: plano.ativo,
        tipo: plano.tipo,
        categoria: plano.categoria,
        limiteUso:
          plano.limitePesquisas !== undefined
            ? plano.limitePesquisas
            : plano.limiteUso !== undefined
            ? plano.limiteUso
            : undefined,
      },
    });
    console.log(`✅ Plano ${plano.categoria} - ${plano.nome} adicionado`);
  }
}

async function main() {
  try {
    console.log(
      "DATABASE_URL no seed:",
      process.env.DATABASE_URL ? "Carregada" : "Não Carregada"
    );

    await upsertEspecialidades();
    await upsertBeneficios();

    // Planos de plataforma (POR_USO)
    await createPlanos(
      [
        ...plataformaSeed,
        ...recrutamentoSemRQESeed,
        ...recrutamentoComRQESeed,
        ...recrutamentoDiversosSeed,
      ],
      "de plataforma"
    );
    console.log("🎉 Seed concluído com sucesso!");
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
