// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { saveLog } from "@/lib/logger";

const SECRET = process.env.JWT_SECRET as string;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  try {
    // Utilizando o Firebase Auth para login com email/senha
    const userCredential = await signInWithEmailAndPassword(
      auth,
      username,
      password
    );

    const user = userCredential.user;

    // Criando o JWT com as informações do Firebase
    const token = jwt.sign({ email: user.email, uid: user.uid }, SECRET, {
      expiresIn: "2h",
    });

    // Armazenando o token no cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 2, // 2 horas
      })
    );

    await saveLog({
      type: "login",
      status: "success",
      data: {
        email: user.email,
        uid: user.uid,
        token,
      },
    });

    return res.status(200).json({ message: "Login bem-sucedido" });
  } catch (error: any) {
    await saveLog({
      type: "login",
      status: "error",
      data: JSON.stringify(error),
    });

    console.error("Erro ao logar:", error);
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
}
