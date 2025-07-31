// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { saveUser } from "@/lib/firebase/saveUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  try {
    const result = await saveUser({ email, password, name });

    if (!result.success) throw result.error;

    res.status(201).json({ uid: result.uid });
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar usuário", error: err });
  }
}
