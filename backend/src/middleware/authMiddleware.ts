// authMiddleware.ts (SUGESTÃO DE MELHORIA)
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { parse } from "cookie"; // Importe o parser de cookie

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        // role: UserRole; // Adicione o papel se aplicável
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não está definido.");
  }

  let token: string | undefined;

  // 1. Tentar obter o token do cabeçalho Authorization (Bearer)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Se não encontrou no Authorization, tentar do cabeçalho Cookie
  if (!token && req.headers.cookie) {
    try {
      const cookies = parse(req.headers.cookie);
      token = cookies.token; // Pega o cookie com nome 'token'
    } catch (e) {
      console.warn("Erro ao parsear cookies:", e);
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }; // Tipo simplificado
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erro na validação do token:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token expirado. Por favor, faça login novamente." });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Token inválido. Acesso negado." });
    }
    return res
      .status(500)
      .json({ message: "Erro interno do servidor na validação do token." });
  }
};
