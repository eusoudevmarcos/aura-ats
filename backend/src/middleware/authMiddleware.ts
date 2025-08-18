import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import { UserRole } from "./roleMiddleware";

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
    throw new Error("Token invalido");
  }

  let token: string | undefined;
  console.log(req.headers.cookie);
  if (req.headers.cookie) {
    token = req.headers.cookie.replace("token=", "");
  } else if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      // role: UserRole;
    };

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
