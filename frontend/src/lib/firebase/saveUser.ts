// lib/firebase/saveUser.ts
import { auth, firestore } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type SaveUserParams = {
  email: string;
  password: string;
  name: string;
};

export async function saveUser({ email, password, name }: SaveUserParams) {
  try {
    // Evita duplicidade verificando se já existe conta com esse email
    const existing = await fetchSignInMethodsForEmail(auth, email);
    if (existing.length > 0) {
      return { success: false, error: new Error("Email já está em uso.") };
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Salva dados adicionais no Firestore
    await setDoc(doc(firestore, "users", user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Erro em saveUser:", error);
    return { success: false, error };
  }
}
