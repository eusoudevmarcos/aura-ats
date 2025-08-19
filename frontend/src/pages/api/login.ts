// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import axios from "axios"; // Importe axios diretamente aqui para clareza
import api from "@/axios";

// Crie uma instância de axios ESPECÍFICA para o backend externo
// Isso é crucial para garantir que você chame o destino correto.
const externalBackendApi = axios.create({
  baseURL: process.env.YOUR_EXTERNAL_BACKEND_URL, // Assegure-se que esta variável de ambiente está definida (ex: "http://localhost:3001")
  timeout: 10000,
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
    const response = await api.post("/api/auth/login", {
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

    res.status(200).json({ uid }); // Retorne o UID para o frontend
  } catch (err: any) {
    console.error("Erro no login:", err?.response?.data || err);
    // Passe o status e a mensagem de erro do backend externo, se disponíveis
    res.status(err?.response?.status || 500).json({
      error: err?.response?.data?.error || "Erro desconhecido no login.",
      details: err?.response?.data, // Útil para depuração
    });
  }
}
