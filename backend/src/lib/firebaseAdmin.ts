import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

let serviceAccount: Record<string, any>;

if (process.env.NODE_ENV === "development") {
  const sdkPath = process.env.FIREBASE_ADMIN_SDK_PATH;
  if (!sdkPath) throw new Error("FIREBASE_ADMIN_SDK_PATH não definido");

  const filePath = path.resolve(sdkPath);
  console.log(filePath);
  console.log("Usando SDK Firebase Admin JSON:", filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Arquivo de credencial Firebase não encontrado em: ${filePath}.`
    );
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  serviceAccount = JSON.parse(raw);
} else {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  console.log(key);
  if (!key) {
    throw new Error(
      "Variável de ambiente FIREBASE_SERVICE_ACCOUNT_KEY não definida em produção."
    );
  }

  try {
    serviceAccount = JSON.parse(key);
  } catch (err) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY não é um JSON válido.");
  }
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const firestoreDB = getFirestore();

export { firestoreDB };
