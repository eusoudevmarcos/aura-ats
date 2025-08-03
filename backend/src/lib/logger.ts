import { firestoreDB } from "./firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function saveLog({
  type,
  status = "success",
  data,
}: {
  type: "login" | "register" | string;
  status: "success" | "error" | "warning";
  data: any;
}) {
  const logEntry = {
    type,
    status,
    timestamp: new Date().toISOString(),
    data: JSON.stringify(data),
  };

  const logsDocRef = firestoreDB.collection("logs").doc("main");

  try {
    await logsDocRef.update({
      entries: FieldValue.arrayUnion(logEntry),
    });
  } catch (err: any) {
    if (err.code === 5 || err.message?.includes("No document to update")) {
      await logsDocRef.set({ entries: [logEntry] });
    } else {
      throw err;
    }
  }
}
