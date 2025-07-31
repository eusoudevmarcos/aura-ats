import type { NextApiRequest, NextApiResponse } from "next";
import { db, ref, get, child } from "@/lib/fireabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const SECRET =
  "87UHddtY6KejUDStQv2oCQx5CzPLES7AqzdthLK5hwCFi4qKpgnRcdTBDfZePiPwV6b7lWD5zylJz2fB0ggXipQ7DTIpJziEzmZVJiFgkMyEWp08SRk1hOZFKiGLVImy5a0Jg2ZfNbT1zHhfrsrhfhUuHUklBZZ1ADPi6prg0VwVotQYefkDNiXDaEe1Xm77EZqkYoCLpLRX8YxXgtsMuEXky6pJkhlYpqMEpTnnTixYpmE5j7aelfB1sJpUhg5Q";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  try {
    const snapshot = await get(child(ref(db), "users"));

    if (!snapshot.exists())
      return res.status(404).json({ error: "Usuários não encontrados" });

    const users = snapshot.val();
    const user: any = Object.values(users).find((u: any) => u.email === email);

    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Senha inválida" });

    const token = jwt.sign({ email: user.email, name: user.name }, SECRET, {
      expiresIn: "2h",
    });

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 2, // 2 horas
      })
    );

    return res.status(200).json({ message: "Login bem-sucedido" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno" });
  }
}
