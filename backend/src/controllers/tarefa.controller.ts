import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { SessaoService } from "../services/sessao.service";
import { TarefaInput, TarefaService } from "../services/tarefa.service";

@injectable()
export class TarefaController {
  constructor(
    @inject(TarefaService) private service: TarefaService,
    @inject(SessaoService) private sessaoService: SessaoService
  ) {}

  async save(req: Request, res: Response) {
    try {
      const data = req.body as TarefaInput;

      // Obter o ID do usuário da sessão
      const token = this.extractToken(req);
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const userId = await this.sessaoService.getUserIdFromToken(token);
      if (!userId) {
        return res.status(401).json({ message: "Sessão inválida ou expirada" });
      }

      // Adicionar o ID do usuário logado
      data.idUsuarioSistema = userId;

      const tarefa = await this.service.save(data);
      return res.status(201).json(tarefa);
    } catch (error: any) {
      console.error("Erro ao salvar tarefa:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao salvar tarefa",
        error,
      });
    }
  }

  async getAllByUsuario(req: Request, res: Response) {
    try {
      // Obter o ID do usuário da sessão
      const token = this.extractToken(req);
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const userId = await this.sessaoService.getUserIdFromToken(token);
      if (!userId) {
        return res.status(401).json({ message: "Sessão inválida ou expirada" });
      }

      const tarefas = await this.service.getAllByUsuario(userId);
      return res.status(200).json(tarefas);
    } catch (error: any) {
      console.error("Erro ao buscar tarefas:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao buscar tarefas",
        error,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tarefa = await this.service.getById(parseInt(id));

      if (!tarefa) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      return res.status(200).json(tarefa);
    } catch (error: any) {
      console.error("Erro ao buscar tarefa:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao buscar tarefa",
        error,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "ID da tarefa é obrigatório" });
      }

      await this.service.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      console.error("Erro ao deletar tarefa:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao deletar tarefa",
        error,
      });
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const { tarefas } = req.body;

      if (!Array.isArray(tarefas)) {
        return res
          .status(400)
          .json({ message: "Lista de tarefas é obrigatória" });
      }

      await this.service.updateOrder(tarefas);
      return res.status(200).json({ message: "Ordem atualizada com sucesso" });
    } catch (error: any) {
      console.error("Erro ao atualizar ordem das tarefas:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao atualizar ordem das tarefas",
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
