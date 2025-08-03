// src/lib/firebaseAdmin.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

let serviceAccount: Record<string, any>;

if (process.env.NODE_ENV === "development") {
  const filePath = path.resolve(
    __dirname,
    "../../auradb-a857f-firebase-adminsdk-fbsvc-8e4a845103.json"
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Arquivo de credencial Firebase não encontrado em: ${filePath}. Certifique-se de que ele exista em desenvolvimento.`
    );
  }

  serviceAccount = require(filePath);
} else {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

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
