// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { saveUser } from "@/lib/firebase/saveUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  try {
    const result = await saveUser({ email, password, name });

    if (!result.success) {
      throw result.error;
    }

    return res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error: any) {
    console.error("Erro no /api/register:", error);
    return res
      .status(500)
      .json({ message: error.message || "Erro ao registrar usuário." });
  }
}
