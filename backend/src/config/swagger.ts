import * as fs from "fs";
import * as path from "path";

// Carregar swagger.json dinamicamente
// Tenta múltiplos caminhos para funcionar em dev e produção
let swaggerPath: string;
const possiblePaths = [
  path.join(__dirname, "swagger.json"), // Produção: dist/config/swagger.json
  path.join(process.cwd(), "src/config/swagger.json"), // Dev: src/config/swagger.json
  path.resolve(__dirname, "../config/swagger.json"), // Fallback
];

swaggerPath = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];

if (!fs.existsSync(swaggerPath)) {
  console.error(
    `Swagger JSON não encontrado. Tentou: ${possiblePaths.join(", ")}`
  );
  throw new Error(`Swagger JSON não encontrado em: ${swaggerPath}`);
}

const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));

// Validar estrutura básica do OpenAPI
if (!swaggerDocument.openapi && !swaggerDocument.swagger) {
  throw new Error("Swagger JSON inválido: falta campo 'openapi' ou 'swagger'");
}

if (!swaggerDocument.info) {
  throw new Error("Swagger JSON inválido: falta campo 'info'");
}

// Ajustar URL do servidor dinamicamente
const PORT = process.env.PORT || "3001";
swaggerDocument.servers = [
  {
    url: `http://localhost:${PORT}/api`,
    description: "Servidor local",
  },
];

export const swaggerSpec = swaggerDocument;
54;
