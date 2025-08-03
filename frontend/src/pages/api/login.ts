// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { saveLog } from "@/lib/logger";

const SECRET = process.env.JWT_SECRET as string;
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  try {
    if (!FIREBASE_API_KEY) {
      throw new Error("FIREBASE_API_KEY não configurada.");
    }

    // Login via REST API do Firebase
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: username,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao autenticar");
    }

    const { idToken, localId, email } = data;

    // Criar um JWT próprio (opcional, você pode usar o idToken direto também)
    const token = jwt.sign({ uid: localId, email }, SECRET, {
      expiresIn: "2h",
    });

    // Setar cookie com JWT
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 2, // 2h
      })
    );

    await saveLog({
      type: "login",
      status: "success",
      data: {
        email,
        uid: localId,
        firebaseIdToken: idToken,
      },
    });

    return res.status(200).json({ message: "Login bem-sucedido" });
  } catch (error: any) {
    await saveLog({
      type: "login",
      status: "error",
      data: { message: error.message },
    });

    console.error("Erro ao logar:", error);
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
}
