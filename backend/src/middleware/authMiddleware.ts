// src/middlewares/authMiddleware.ts (ou onde você preferir organizar seus middlewares)
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Defina uma interface para estender o objeto Request do Express
// Isso permite adicionar a propriedade 'user' com segurança de tipo
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string; // Exemplo: ID do usuário
        // Adicione outras propriedades do payload do seu token que você espera aqui
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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message:
        "Acesso negado. Token não fornecido ou formato inválido (Bearer token).",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!JWT_SECRET) {
      throw new Error("Token não fornecido");
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

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
