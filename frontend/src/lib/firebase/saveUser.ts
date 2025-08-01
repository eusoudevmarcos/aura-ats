// lib/firebase/saveUser.ts
import { firestore } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

interface User {
  email: string;
  password: string;
  name?: string;
}

export async function saveUser(user: User) {
  const uid = uuidv4();
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const userData = {
    uid,
    email: user.email,
    password: hashedPassword,
    name: user.name || "",
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(firestore, "users", uid), userData);
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar usuário no Firestore:", error);
    return { success: false, error };
  }
}
