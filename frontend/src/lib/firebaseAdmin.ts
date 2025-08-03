import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../auradb-a857f-firebase-adminsdk-fbsvc-8e4a845103.json";

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount as any) });
}

const adminDb = getFirestore();

export { adminDb };
