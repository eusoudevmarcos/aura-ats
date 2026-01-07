import { Request } from "express";
import { inject, injectable } from "tsyringe";
import { Controller, Get, Post, Put, Delete, Param, Body, QueryParam, Req } from "routing-controllers";
import { KanbanService } from "../services/kanban.service";
import {
  CardKanbanInput,
  ColunaKanbanInput,
  ComentarioCardInput,
  EspacoTrabalhoInput,
  MoverCardInput,
  MoverColunaInput,
  QuadroKanbanInput,
  VincularEntidadeInput,
} from "../types/kanban.type";
import { Authorized } from "../decorators/Authorized";

@injectable()
@Controller("/kanban")
export class KanbanController {
  constructor(@inject(KanbanService) private service: KanbanService) {}

  /**
   * Extrai o token do request (headers ou cookies)
   */
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

  // ===================== ESPAÇO DE TRABALHO =====================

  @Post("/espaco-trabalho")
  @Authorized()
  async criarEspacoTrabalho(@Body() data: EspacoTrabalhoInput, @Req() req: Request) {
    const token = this.extractToken(req);
    const espacoTrabalho = await this.service.criarEspacoTrabalho(data, token);
    return espacoTrabalho;
  }

  @Get("/espaco-trabalho")
  @Authorized()
  async listarEspacosTrabalho() {
    const espacosTrabalho = await this.service.listarEspacosTrabalho();
    return espacosTrabalho;
  }

  @Get("/espaco-trabalho/:id")
  @Authorized()
  async obterEspacoTrabalhoPorId(@Param("id") id: string) {
    const espacoTrabalho = await this.service.obterEspacoTrabalhoPorId(id);
    if (!espacoTrabalho) {
      throw new Error("Espaço de trabalho não encontrado");
    }
    return espacoTrabalho;
  }

  @Put("/espaco-trabalho/:id")
  @Authorized()
  async atualizarEspacoTrabalho(
    @Param("id") id: string,
    @Body() data: Partial<EspacoTrabalhoInput>
  ) {
    const espacoTrabalho = await this.service.atualizarEspacoTrabalho(
      id,
      data
    );
    return espacoTrabalho;
  }

  @Delete("/espaco-trabalho/:id")
  @Authorized()
  async deletarEspacoTrabalho(@Param("id") id: string) {
    await this.service.deletarEspacoTrabalho(id);
    return { message: "Espaço de trabalho deletado com sucesso" };
  }

  // ===================== QUADRO KANBAN =====================

  @Post("/quadro")
  @Authorized()
  async criarQuadroKanban(@Body() data: QuadroKanbanInput, @Req() req: Request) {
    const token = this.extractToken(req);
    const quadro = await this.service.criarQuadroKanban(data, token);
    return quadro;
  }

  @Get("/quadro/:id")
  @Authorized()
  async obterQuadroCompleto(@Param("id") id: string) {
    const quadro = await this.service.obterQuadroCompleto(id);
    if (!quadro) {
      throw new Error("Quadro não encontrado");
    }
    return quadro;
  }

  @Put("/quadro/:id")
  @Authorized()
  async atualizarQuadroKanban(
    @Param("id") id: string,
    @Body() data: Partial<QuadroKanbanInput>
  ) {
    const quadro = await this.service.atualizarQuadroKanban(id, data);
    return quadro;
  }

  @Delete("/quadro/:id")
  @Authorized()
  async deletarQuadroKanban(@Param("id") id: string) {
    await this.service.deletarQuadroKanban(id);
    return { message: "Quadro deletado com sucesso" };
  }

  // ===================== COLUNA KANBAN =====================

  @Post("/coluna")
  @Authorized()
  async criarColunaKanban(@Body() data: ColunaKanbanInput) {
    const coluna = await this.service.criarColunaKanban(data);
    return coluna;
  }

  @Put("/coluna/:id")
  @Authorized()
  async atualizarColunaKanban(
    @Param("id") id: string,
    @Body() data: Partial<ColunaKanbanInput>
  ) {
    const coluna = await this.service.atualizarColunaKanban(id, data);
    return coluna;
  }

  @Post("/coluna/mover")
  @Authorized()
  async moverColuna(@Body() data: MoverColunaInput) {
    const coluna = await this.service.moverColuna(data);
    return coluna;
  }

  @Delete("/coluna/:id")
  @Authorized()
  async deletarColunaKanban(@Param("id") id: string) {
    await this.service.deletarColunaKanban(id);
    return { message: "Coluna deletada com sucesso" };
  }

  // ===================== CARD KANBAN =====================

  @Post("/card")
  @Authorized()
  async criarCardKanban(@Body() data: CardKanbanInput, @Req() req: Request) {
    const token = this.extractToken(req);
    const card = await this.service.criarCardKanban(data, token);
    return card;
  }

  @Post("/card/mover")
  @Authorized()
  async moverCard(@Body() data: MoverCardInput) {
    const card = await this.service.moverCard(data);
    return card;
  }

  @Put("/card/:id")
  @Authorized()
  async atualizarCardKanban(
    @Param("id") id: string,
    @Body() data: Partial<CardKanbanInput>
  ) {
    const card = await this.service.atualizarCardKanban(id, data);
    return card;
  }

  @Delete("/card/:id")
  @Authorized()
  async deletarCardKanban(@Param("id") id: string) {
    await this.service.deletarCardKanban(id);
    return { message: "Card deletado com sucesso" };
  }

  // ===================== VÍNCULOS =====================

  @Post("/vinculo")
  @Authorized()
  async vincularEntidade(@Body() data: VincularEntidadeInput) {
    const vinculo = await this.service.vincularEntidadeAoCard(data);
    return vinculo;
  }

  @Delete("/vinculo/:id")
  @Authorized()
  async removerVinculo(@Param("id") id: string) {
    await this.service.removerVinculo(id);
    return { message: "Vínculo removido com sucesso" };
  }

  @Get("/card/:cardId/vinculos")
  @Authorized()
  async listarVinculosDoCard(@Param("cardId") cardId: string) {
    const vinculos = await this.service.listarVinculosDoCard(cardId);
    return vinculos;
  }

  // ===================== AUTOCOMPLETE =====================

  @Get("/autocomplete/:tipo")
  @Authorized()
  async buscarEntidadesParaAutocomplete(
    @Param("tipo") tipo: string,
    @QueryParam("search", { required: false }) search: string = "",
    @QueryParam("limit", { required: false }) limit: number = 10
  ) {
    const entidades = await this.service.buscarEntidadesParaAutocomplete(
      tipo as any,
      search,
      limit
    );
    return entidades;
  }

  // ===================== COMENTÁRIOS =====================

  @Post("/card/:cardId/comentario")
  @Authorized()
  async criarComentarioCard(
    @Param("cardId") cardId: string,
    @Body() body: ComentarioCardInput,
    @Req() req: Request
  ) {
    const data: ComentarioCardInput = { ...body, cardKanbanId: cardId };
    const token = this.extractToken(req);
    const comentario = await this.service.criarComentarioCard(data, token);
    return comentario;
  }

  @Get("/card/:cardId/comentarios")
  @Authorized()
  async listarComentariosDoCard(@Param("cardId") cardId: string) {
    const comentarios = await this.service.listarComentariosDoCard(cardId);
    return comentarios;
  }

  @Put("/comentario/:id")
  @Authorized()
  async atualizarComentarioCard(
    @Param("id") id: string,
    @Body() data: Partial<ComentarioCardInput>
  ) {
    const comentario = await this.service.atualizarComentarioCard(id, data);
    return comentario;
  }

  @Delete("/comentario/:id")
  @Authorized()
  async deletarComentarioCard(@Param("id") id: string) {
    await this.service.deletarComentarioCard(id);
    return { message: "Comentário deletado com sucesso" };
  }
}
