// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import api from "@/axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { username, password } = req.body;

  try {
    // Chamada para sua API de autenticação
    const response = await api.post("/api/auth/login", {
      username,
      password,
    });

    const { token, uid } = response.data;

    const serialized = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 horas
    });

    res.setHeader("Set-Cookie", serialized);
    res.status(200).json({ uid });
  } catch (err: any) {
    console.error("Erro no login:", err?.response?.data || err.message);
    res.status(401).json({ error: "Usuário ou senha inválidos." });
  }
}
