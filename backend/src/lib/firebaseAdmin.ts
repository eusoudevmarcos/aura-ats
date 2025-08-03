import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// Caminho para o JSON da conta de serviço via .env
const sdkPath = process.env.FIREBASE_ADMIN_SDK_PATH;
if (!sdkPath) {
  throw new Error(
    "A variável de ambiente FIREBASE_ADMIN_SDK_PATH não está definida."
  );
}

// Resolve caminho absoluto
const filePath = path.resolve(sdkPath);
console.log("Usando SDK Firebase Admin JSON:", filePath);

// Verifica se o arquivo existe
if (!fs.existsSync(filePath)) {
  throw new Error(
    `Arquivo de credencial Firebase não encontrado em: ${filePath}`
  );
}

// Faz a leitura e parse seguro do JSON
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

// Inicializa o Firebase Admin se ainda não estiver inicializado
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const firestoreDB = getFirestore();
export { firestoreDB };
