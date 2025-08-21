// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import axios from "axios";

const externalBackendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // timeout: 10000,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { username, password } = req.body;

  try {
    const response = await externalBackendApi.post("/api/auth/login", {
      username,
      password,
    });

    const { uid } = response.data;

    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    } else {
      console.warn(
        "Backend externo não retornou o cabeçalho 'Set-Cookie' com o token."
      );
    }

    res.status(200).json({ uid });
  } catch (err: any) {
    console.error("Erro no login:", err?.response?.data || err);
    res.status(err?.response?.status || 500).json({
      error: err?.response?.data?.error || "Erro desconhecido no login.",
      details: err?.response?.data,
    });
  }
}
