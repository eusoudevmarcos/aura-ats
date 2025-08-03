// pages/api/set-cookie.ts
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token não fornecido." });
  }

  const serialized = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2, // 2 horas
  });

  res.setHeader("Set-Cookie", serialized);
  res.status(200).json({ message: "Token salvo no cookie." });
}
