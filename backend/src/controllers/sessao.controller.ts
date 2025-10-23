import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { SessaoService } from "../services/sessao.service";

@injectable()
export class SessaoController {
  constructor(@inject(SessaoService) private service: SessaoService) {}

  async getCurrentSession(req: Request, res: Response) {
    try {
      const token = this.extractToken(req);

      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const sessao = await this.service.findByToken(token);

      if (!sessao) {
        return res.status(404).json({ message: "Sessão não encontrada" });
      }

      if (sessao.expiresAt <= new Date()) {
        return res.status(401).json({ message: "Sessão expirada" });
      }

      return res.status(200).json({
        id: sessao.id,
        userId: sessao.usuarioSistemaId,
        expiresAt: sessao.expiresAt,
        usuarioSistema: (sessao as any).usuarioSistema,
      });
    } catch (error: any) {
      console.error("Erro ao buscar sessão atual:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao buscar sessão atual",
        error,
      });
    }
  }

  async getUserId(req: Request, res: Response) {
    try {
      const token = this.extractToken(req);

      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const userId = await this.service.getUserIdFromToken(token);

      if (!userId) {
        return res
          .status(404)
          .json({ message: "Usuário não encontrado na sessão" });
      }

      return res.status(200).json({ userId });
    } catch (error: any) {
      console.error("Erro ao buscar ID do usuário:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao buscar ID do usuário",
        error,
      });
    }
  }

  async validateSession(req: Request, res: Response) {
    try {
      const token = this.extractToken(req);

      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const isValid = await this.service.isValid(token);

      return res.status(200).json({ valid: isValid });
    } catch (error: any) {
      console.error("Erro ao validar sessão:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao validar sessão",
        error,
      });
    }
  }

  async deleteSession(req: Request, res: Response) {
    try {
      const token = this.extractToken(req);

      if (!token) {
        return res.status(400).json({ message: "Token não fornecido" });
      }

      await this.service.delete(token);

      return res.status(204).send();
    } catch (error: any) {
      console.error("Erro ao deletar sessão:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao deletar sessão",
        error,
      });
    }
  }

  async deleteAllUserSessions(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "ID do usuário é obrigatório" });
      }

      await this.service.deleteByUserId(userId);

      return res.status(204).send();
    } catch (error: any) {
      console.error("Erro ao deletar todas as sessões do usuário:", error);
      return res.status(500).json({
        message:
          error?.message || "Erro ao deletar todas as sessões do usuário",
        error,
      });
    }
  }

  async cleanupExpiredSessions(req: Request, res: Response) {
    try {
      await this.service.deleteExpired();

      return res
        .status(200)
        .json({ message: "Sessões expiradas removidas com sucesso" });
    } catch (error: any) {
      console.error("Erro ao limpar sessões expiradas:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao limpar sessões expiradas",
        error,
      });
    }
  }

  private extractToken(req: Request): string | null {
    // 1. Authorization: Bearer
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    }

    // 2. Cookies
    if (req.headers.cookie) {
      try {
        const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        return cookies.token || null;
      } catch (e) {
        console.warn("Erro ao parsear cookies:", e);
      }
    }

    return null;
  }
}
