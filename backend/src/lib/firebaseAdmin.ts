import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// O FIREBASE_ADMIN_SDK_PATH será apenas o nome do arquivo, ex: "firebase-admin.json"
const sdkFileName = process.env.FIREBASE_ADMIN_SDK_PATH;

if (!sdkFileName) {
  throw new Error(
    "A variável de ambiente FIREBASE_ADMIN_SDK_PATH não está definida."
  );
}

/**
 * Ajusta o caminho para funcionar localmente e no Render.
 * - __dirname pode variar conforme build (src/lib em dev, dist/src/lib em produção)
 * - rootDir aponta para a raiz do projeto em qualquer ambiente.
 */
const rootDir =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../../..")
    : path.resolve(__dirname, "../..");

// Caminho relativo à raiz do projeto para o diretório secrets
const filePath = path.resolve(rootDir, "src/public/etc/secrets", sdkFileName);

console.log("Usando SDK Firebase Admin JSON:", filePath);

if (!fs.existsSync(filePath)) {
  throw new Error(
    `Arquivo de credencial Firebase não encontrado em: ${filePath}`
  );
}

let serviceAccount: Record<string, any>;
try {
  const raw = fs.readFileSync(filePath, "utf-8");
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
