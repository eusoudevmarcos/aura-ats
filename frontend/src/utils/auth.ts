import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

const SECRET = "sua_chave_secreta_jwt";

export function verifyToken(req: NextApiRequest) {
  const token = req.cookies.token;
  if (!token) throw new Error("Token ausente");

  return jwt.verify(token, SECRET);
}
