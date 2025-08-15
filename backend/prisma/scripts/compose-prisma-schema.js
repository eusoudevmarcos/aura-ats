const fs = require("fs");
const path = require("path");

const schemaDir = path.join(__dirname, "../prisma/schemas");
const mainSchemaPath = path.join(__dirname, "../prisma/schema.prisma");

// Conteúdo fixo que geralmente vai no topo do schema.prisma
const fixedHeader = `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
`;

function composeSchema() {
  let composedSchema = fixedHeader;

  const files = fs.readdirSync(schemaDir).sort(); // Garante ordem alfabética ou outra ordem que você preferir

  for (const file of files) {
    if (file.endsWith(".prisma")) {
      const filePath = path.join(schemaDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      composedSchema += `\n// Start of ${file}\n`;
      composedSchema += content;
      composedSchema += `\n// End of ${file}\n`;
    }
  }

  fs.writeFileSync(mainSchemaPath, composedSchema);
  console.log("Prisma schema composed successfully!");
}

composeSchema();
