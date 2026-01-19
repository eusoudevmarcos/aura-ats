import { cert, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

/**
 * Busca arquivo de credenciais Firebase no root do backend.
 * Procura por arquivos que contenham "firebase-adminsdk" no nome (case-insensitive).
 * 
 * @returns Caminho do arquivo encontrado ou null se não encontrar
 */
function findFirebaseCredentialsFile(): string | null {
  // Resolve o root do backend (em produção está em dist/src/lib, precisa subir 2 níveis)
  const backendRoot =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "../../../")
      : path.resolve(__dirname, "../../");

  if (!fs.existsSync(backendRoot)) {
    return null;
  }

  try {
    const files = fs.readdirSync(backendRoot);
    const firebaseFile = files.find((file) =>
      file.toLowerCase().includes("firebase-adminsdk") && file.endsWith(".json")
    );

    if (firebaseFile) {
      return path.resolve(backendRoot, firebaseFile);
    }
  } catch (err) {
    console.warn("Erro ao buscar arquivo Firebase:", (err as Error).message);
  }

  return null;
}

/**
 * Valida se o arquivo JSON contém os campos necessários para Firebase Admin SDK
 */
function validateFirebaseCredentials(serviceAccount: Record<string, any>): boolean {
  const requiredFields = ["type", "project_id", "private_key_id", "private_key", "client_email"];
  return requiredFields.every((field) => field in serviceAccount);
}

/**
 * Inicializa o Firebase Admin SDK se o arquivo de credenciais for encontrado.
 * Se não encontrar, retorna null (Firebase é opcional).
 */
function initializeFirebase(): Firestore | null {
  const credFilePath = findFirebaseCredentialsFile();

  if (!credFilePath) {
    console.warn(
      "Firebase Admin SDK: Arquivo de credenciais não encontrado no root do backend. " +
      "A aplicação continuará funcionando, mas funcionalidades do Firebase estarão desabilitadas."
    );
    return null;
  }

  console.log("Firebase Admin SDK: Usando credenciais de:", credFilePath);

  let serviceAccount: Record<string, any>;
  try {
    const raw = fs.readFileSync(credFilePath, "utf-8");
    serviceAccount = JSON.parse(raw);
  } catch (err) {
    console.error(
      "Firebase Admin SDK: Erro ao ler ou parsear o arquivo de credenciais:",
      (err as Error).message
    );
    return null;
  }

  if (!validateFirebaseCredentials(serviceAccount)) {
    console.error(
      "Firebase Admin SDK: Arquivo de credenciais inválido. Campos obrigatórios ausentes."
    );
    return null;
  }

  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
    return getFirestore();
  } catch (err) {
    console.error(
      "Firebase Admin SDK: Erro ao inicializar Firebase:",
      (err as Error).message
    );
    return null;
  }
}

const firestoreDB = initializeFirebase();
export { firestoreDB };

