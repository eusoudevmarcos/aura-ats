import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import { BeneficiosSeed } from "./seed/beneficios";
import {
  billingPlataformSeed,
  billingRecrutamentoSemRQESeed,
  planosComRQE,
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
async function upsertPlanos(planoList: any[], tipoDesc: string) {
  for (const plano of planoList) {
    // O campo unique em Plano é 'id'; 'nome' não é unique
    // Então precisamos buscar pelo nome, se existir faz update, senão cria.
    const planoExistente = await prisma.plano.findFirst({
      where: { nome: plano.nome },
    });

    if (planoExistente) {
      await prisma.plano.update({
        where: { id: planoExistente.id },
        data: {
          descricao: plano.descricao,
          preco: plano.preco,
          diasGarantia: plano.diasGarantia,
          ativo: plano.ativo,
          tipo: plano.tipo,
          limiteUso:
            plano.limitePesquisas !== undefined
              ? plano.limitePesquisas
              : plano.limiteUso !== undefined
              ? plano.limiteUso
              : undefined,
        },
      });
    } else {
      await prisma.plano.create({
        data: {
          nome: plano.nome,
          descricao: plano.descricao,
          preco: plano.preco,
          diasGarantia: plano.diasGarantia,
          ativo: plano.ativo,
          tipo: plano.tipo,
          limiteUso:
            plano.limitePesquisas !== undefined
              ? plano.limitePesquisas
              : plano.limiteUso !== undefined
              ? plano.limiteUso
              : undefined,
        },
      });
    }
  }
  console.log(
    `✅ ${planoList.length} planos ${tipoDesc} adicionados/atualizados.`
  );
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
    await upsertPlanos(billingPlataformSeed, "de plataforma");

    // Planos de recrutamento SEM RQE (MENSAL)
    await upsertPlanos(
      billingRecrutamentoSemRQESeed,
      "de recrutamento SEM RQE"
    );

    // Planos de recrutamento COM RQE (MENSAL)
    await upsertPlanos(planosComRQE, "de recrutamento COM RQE");

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
