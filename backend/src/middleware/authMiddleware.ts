// authMiddleware.ts
import { parse } from "cookie";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        tipo: string;
        nome?: string;
        cpf?: string;
        razaoSocial?: string;
        cnpj?: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware compatível com routing-controllers
@Middleware({ type: "before" })
export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET não está definido.");
    }
    let token: string | undefined;

    // 1. Authorization: Bearer
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Cookies
    if (!token && req.headers.cookie) {
      try {
        const cookies = parse(req.headers.cookie);
        token = cookies.token;
      } catch (e) {
        console.warn("Erro ao parsear cookies:", e);
      }
    }

    if (!token) {
      res.status(401).json({ message: "Acesso negado. Token não fornecido." });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as Request["user"];
      req.user = decoded;
      next();
    } catch (error) {
      console.log("Erro na validação do token:", error);
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Token expirado. Faça login novamente." });
        return;
      }
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: "Token inválido. Acesso negado." });
        return;
      }
      res.status(500).json({ message: "Erro interno na validação do token." });
      return;
    }
  }
}

// Exportar também a função para compatibilidade (se necessário)
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const middleware = new AuthMiddleware();
  middleware.use(req, res, next);
};
