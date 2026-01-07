import { Request } from "express";
import { inject, injectable } from "tsyringe";
import { Controller, Get, Delete, Param, Req } from "routing-controllers";
import { SessaoService } from "../services/sessao.service";
import { Authorized } from "../decorators/Authorized";

@injectable()
@Controller("/sessao")
export class SessaoController {
  constructor(@inject(SessaoService) private service: SessaoService) {}

  @Get("/current")
  @Authorized()
  async getCurrentSession(@Req() req: Request) {
    const token = this.extractToken(req);

    if (!token) {
      throw new Error("Token não fornecido");
    }

    const sessao = await this.service.findByToken(token);

    if (!sessao) {
      throw new Error("Sessão não encontrada");
    }

    if (sessao.expiresAt <= new Date()) {
      throw new Error("Sessão expirada");
    }

    return {
      id: sessao.id,
      userId: sessao.usuarioSistemaId,
      expiresAt: sessao.expiresAt,
      usuarioSistema: (sessao as any).usuarioSistema,
    };
  }

  @Get("/user-id")
  @Authorized()
  async getUserId(@Req() req: Request) {
    const token = this.extractToken(req);

    if (!token) {
      throw new Error("Token não fornecido");
    }

    const userId = await this.service.getUserIdFromToken(token);

    if (!userId) {
      throw new Error("Usuário não encontrado na sessão");
    }

    return { userId };
  }

  @Get("/validate")
  @Authorized()
  async validateSession(@Req() req: Request) {
    const token = this.extractToken(req);

    if (!token) {
      throw new Error("Token não fornecido");
    }

    const isValid = await this.service.isValid(token);

    return { valid: isValid };
  }

  @Delete("/")
  @Authorized()
  async deleteSession(@Req() req: Request) {
    const token = this.extractToken(req);

    if (!token) {
      throw new Error("Token não fornecido");
    }

    await this.service.delete(token);

    return { message: "Sessão deletada com sucesso" };
  }

  @Delete("/user/:userId")
  @Authorized()
  async deleteAllUserSessions(@Param("userId") userId: string) {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório");
    }

    await this.service.deleteByUserId(userId);

    return { message: "Sessões deletadas com sucesso" };
  }

  @Delete("/cleanup")
  @Authorized()
  async cleanupExpiredSessions() {
    await this.service.deleteExpired();

    return { message: "Sessões expiradas removidas com sucesso" };
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
