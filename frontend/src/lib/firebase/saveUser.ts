// lib/firebase/saveUser.ts
import { db } from "@/lib/fireabase";
import bcrypt from "bcryptjs";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

interface User {
  email: string;
  password: string;
  name?: string;
}

export async function saveUser(user: User) {
  const uid = uuidv4(); // Gera um ID único

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const userData = {
    uid,
    email: user.email,
    password: hashedPassword, // Em produção, criptografe com bcrypt!
    name: user.name || "",
    createdAt: new Date().toISOString(),
  };

  const userRef = ref(db, `users/${uid}`);

  try {
    await set(userRef, userData);
    return { success: true, uid };
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    return { success: false, error };
  }
}
