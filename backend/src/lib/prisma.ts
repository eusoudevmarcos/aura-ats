import { PrismaClient } from "@prisma/client";

// Configuração específica para Supabase
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn", "info"]
        : ["error"],

    // Configurações específicas para Supabase
    transactionOptions: {
      maxWait: 5000, // Tempo máximo para aguardar uma transação (5s)
      timeout: 10000, // Timeout da transação (10s)
      isolationLevel: "ReadCommitted", // Nível de isolamento recomendado para Supabase
    },
  });

// Previne múltiplas instâncias do Prisma Client em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
