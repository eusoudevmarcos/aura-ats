import { Request } from "express";
import { inject, injectable } from "tsyringe";
import { Controller, Get, Post, Put, Delete, Param, Body, Req } from "routing-controllers";
import { SessaoService } from "../services/sessao.service";
import { TarefaInput, TarefaService } from "../services/tarefa.service";
import { Authorized } from "../decorators/Authorized";

@injectable()
@Controller("/tarefa")
export class TarefaController {
  constructor(
    @inject(TarefaService) private service: TarefaService,
    @inject(SessaoService) private sessaoService: SessaoService
  ) {}

  @Post("/")
  @Authorized()
  async save(@Body() data: TarefaInput, @Req() req: Request) {
    // Obter o ID do usuário da sessão
    const token = this.extractToken(req);
    if (!token) {
      throw new Error("Token não fornecido");
    }

    const userId = await this.sessaoService.getUserIdFromToken(token);
    if (!userId) {
      throw new Error("Sessão inválida ou expirada");
    }

    // Adicionar o ID do usuário logado
    data.idUsuarioSistema = userId;

    const tarefa = await this.service.save(data);
    return tarefa;
  }

  @Get("/")
  @Authorized()
  async getAllByUsuario(@Req() req: Request) {
    // Obter o ID do usuário da sessão
    const token = this.extractToken(req);
    if (!token) {
      throw new Error("Token não fornecido");
    }

    const userId = await this.sessaoService.getUserIdFromToken(token);
    if (!userId) {
      throw new Error("Sessão inválida ou expirada");
    }

    const tarefas = await this.service.getAllByUsuario(userId);
    return tarefas;
  }

  @Get("/:id")
  @Authorized()
  async getById(@Param("id") id: string) {
    const tarefa = await this.service.getById(parseInt(id));

    if (!tarefa) {
      throw new Error("Tarefa não encontrada");
    }

    return tarefa;
  }

  @Delete("/")
  @Authorized()
  async delete(@Body() body: { id: string }) {
    const { id } = body;

    if (!id) {
      throw new Error("ID da tarefa é obrigatório");
    }

    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new Error("ID da tarefa deve ser um número válido");
    }

    await this.service.delete(idNumber);
    return { message: "Tarefa deletada com sucesso" };
  }

  @Put("/order")
  @Authorized()
  async updateOrder(@Body() body: { tarefas: any[] }) {
    const { tarefas } = body;

    if (!Array.isArray(tarefas)) {
      throw new Error("Lista de tarefas é obrigatória");
    }

    await this.service.updateOrder(tarefas);
    return { message: "Ordem atualizada com sucesso" };
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
