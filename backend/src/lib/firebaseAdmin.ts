import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// O FIREBASE_ADMIN_SDK_PATH deve ser APENAS o nome do arquivo, ex: "firebase-admin.json"
const sdkFileName = process.env.FIREBASE_ADMIN_SDK_PATH;

if (!sdkFileName) {
  throw new Error(
    "A variável de ambiente FIREBASE_ADMIN_SDK_PATH não está definida."
  );
}

/**
 * Ajusta o caminho corretamente para desenvolvimento e produção.
 *
 * - Em dev:           /backend/src/public/etc/secrets/<arquivo>
 * - Em produção:      /opt/render/project/src/backend/src/public/etc/secrets/<arquivo>
 *
 * No Render, a pasta de trabalho é /opt/render/project/src/backend/dist,
 * mas os arquivos estáticos NÃO são transpilados, então 'src/public/etc/secrets'
 * existe em tempo de execução na raiz do projeto (mesmo após o build do TypeScript).
 *
 * Em produção, o __dirname será algo como "/opt/render/project/src/backend/dist/src/lib"
 * e precisamos subir alguns níveis até a raiz DO PROJETO e ACESSAR 'src/public/etc/secrets'
 */

// resolve até a raiz do projeto (em produção está em dist/src/lib, precisa subir 3 níveis)
const projectRoot =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../../../../")
    : path.resolve(__dirname, "../..");

// Caminho correto (mantém src/public/etc/secrets em ambos ambientes)
const credFilePath = path.resolve(
  projectRoot,
  "src/public/etc/secrets",
  sdkFileName
);

console.log("Usando SDK Firebase Admin JSON:", credFilePath);

if (!fs.existsSync(credFilePath)) {
  throw new Error(
    `Arquivo de credencial Firebase não encontrado em: ${credFilePath}`
  );
}

let serviceAccount: Record<string, any>;
try {
  const raw = fs.readFileSync(credFilePath, "utf-8");
  serviceAccount = JSON.parse(raw);
} catch (err) {
  throw new Error(
    "Erro ao ler ou parsear o arquivo de credencial Firebase: " +
      (err as Error).message
  );
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const firestoreDB = getFirestore();
export { firestoreDB };
