import { Request } from "express";
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req } from "routing-controllers";
import { inject, injectable } from "tsyringe";
import { Authorized } from "../decorators/Authorized";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import { KanbanService } from "../services/kanban.service";
import {
  CardEtiquetasInput,
  CardKanbanDataInput,
  CardKanbanInput,
  ChecklistCardInput,
  ChecklistItemInput,
  ColunaKanbanInput,
  ComentarioCardInput,
  EspacoTrabalhoInput,
  EtiquetaQuadroInput,
  MembroCardInput,
  MoverCardInput,
  MoverColunaInput,
  QuadroKanbanInput,
  VincularEntidadeInput,
} from "../types/kanban.type";

@injectable()
@Controller("/kanban")
export class KanbanController {
  constructor(@inject(KanbanService) private service: KanbanService) { }

  /**
   * Normaliza parâmetros de busca vindos da query string.
   * - Converte strings vazias em undefined
   * - Se vier um JSON stringificado válido, faz o parse
   */
  private normalizeSearch(search: any): any {
    if (search === undefined || search === null) return undefined;
    if (typeof search !== "string") return search;

    const trimmed = search.trim();
    if (!trimmed) return undefined;

    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return trimmed;
      }
    }

    return trimmed;
  }

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
    return nonEmptyAndConvertDataDTO(espacosTrabalho);
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

  // ===================== ETIQUETAS =====================

  @Post("/quadro/:id/etiqueta")
  @Authorized()
  async criarEtiquetaQuadro(
    @Param("id") quadroId: string,
    @Body() data: Omit<EtiquetaQuadroInput, "quadroKanbanId">
  ) {
    const etiqueta = await this.service.criarEtiquetaQuadro(quadroId, data);
    return etiqueta;
  }

  @Get("/quadro/:id/etiquetas")
  @Authorized()
  async listarEtiquetasDoQuadro(@Param("id") quadroId: string) {
    const etiquetas = await this.service.listarEtiquetasDoQuadro(quadroId);
    return etiquetas;
  }

  @Put("/etiqueta/:id")
  @Authorized()
  async atualizarEtiquetaQuadro(
    @Param("id") id: string,
    @Body() data: Partial<Omit<EtiquetaQuadroInput, "quadroKanbanId">>
  ) {
    const etiqueta = await this.service.atualizarEtiquetaQuadro(id, data);
    return etiqueta;
  }

  @Delete("/etiqueta/:id")
  @Authorized()
  async deletarEtiquetaQuadro(@Param("id") id: string) {
    await this.service.deletarEtiquetaQuadro(id);
    return { message: "Etiqueta deletada com sucesso" };
  }

  @Put("/card/:id/etiquetas")
  @Authorized()
  async atualizarEtiquetasDoCard(
    @Param("id") cardId: string,
    @Body() data: CardEtiquetasInput
  ) {
    const card = await this.service.atualizarEtiquetasDoCard(cardId, data);
    return card;
  }

  // ===================== DATAS DO CARD =====================

  @Put("/card/:id/datas")
  @Authorized()
  async upsertCardData(
    @Param("id") cardId: string,
    @Body() data: CardKanbanDataInput
  ) {
    const result = await this.service.upsertCardData(cardId, data);
    return result;
  }

  @Get("/card/:id/datas")
  @Authorized()
  async obterCardData(@Param("id") cardId: string) {
    const result = await this.service.obterCardData(cardId);
    return result;
  }

  // ===================== CHECKLIST =====================

  @Post("/card/:cardId/checklist")
  @Authorized()
  async criarChecklist(
    @Param("cardId") cardId: string,
    @Body() data: ChecklistCardInput
  ) {
    const checklist = await this.service.criarChecklist(cardId, data);
    return checklist;
  }

  @Put("/checklist/:id")
  @Authorized()
  async atualizarChecklist(
    @Param("id") id: string,
    @Body() data: Partial<ChecklistCardInput>
  ) {
    const checklist = await this.service.atualizarChecklist(id, data);
    return checklist;
  }

  @Delete("/checklist/:id")
  @Authorized()
  async deletarChecklist(@Param("id") id: string) {
    await this.service.deletarChecklist(id);
    return { message: "Checklist deletado com sucesso" };
  }

  @Post("/checklist/:checklistId/item")
  @Authorized()
  async criarChecklistItem(
    @Param("checklistId") checklistId: string,
    @Body() data: ChecklistItemInput
  ) {
    const item = await this.service.criarChecklistItem(checklistId, data);
    return item;
  }

  @Put("/checklist-item/:id")
  @Authorized()
  async atualizarChecklistItem(
    @Param("id") id: string,
    @Body() data: Partial<ChecklistItemInput>
  ) {
    const item = await this.service.atualizarChecklistItem(id, data);
    return item;
  }

  @Delete("/checklist-item/:id")
  @Authorized()
  async deletarChecklistItem(@Param("id") id: string) {
    await this.service.deletarChecklistItem(id);
    return { message: "Item de checklist deletado com sucesso" };
  }

  @Put("/card/:id/checklist-completo")
  @Authorized()
  async toggleChecklistCompleto(
    @Param("id") cardId: string,
    @Body() body: { completo: boolean }
  ) {
    const card = await this.service.toggleChecklistCompleto(
      cardId,
      body.completo
    );
    return card;
  }

  // ===================== MEMBROS DO CARD =====================

  @Post("/card/:cardId/membro")
  @Authorized()
  async adicionarMembroAoCard(
    @Param("cardId") cardId: string,
    @Body() body: Omit<MembroCardInput, "cardId">
  ) {
    const membro = await this.service.adicionarMembroAoCard({
      cardId,
      usuarioSistemaId: body.usuarioSistemaId,
    });
    return membro;
  }

  @Delete("/card/:cardId/membro/:usuarioId")
  @Authorized()
  async removerMembroDoCard(
    @Param("cardId") cardId: string,
    @Param("usuarioId") usuarioId: string
  ) {
    await this.service.removerMembroDoCard(cardId, usuarioId);
    return { message: "Membro removido com sucesso" };
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
    @QueryParam("search", { required: false }) search?: string,
    @QueryParam("limit", { required: false }) limit: number = 10
  ) {
    const normalizedSearch = this.normalizeSearch(search);

    const entidades = await this.service.buscarEntidadesParaAutocomplete(
      tipo as any,
      normalizedSearch ?? "",
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

  // ===================== BUSCA DE USUÁRIOS DO SISTEMA =====================

  @Get("/usuarios-sistema")
  @Authorized()
  async buscarUsuariosSistema(
    @QueryParam("search", { required: false }) search?: string,
    @QueryParam("limit", { required: false }) limit: number = 10
  ) {
    const normalizedSearch = this.normalizeSearch(search);
    const usuarios = await this.service.buscarUsuariosSistema(
      normalizedSearch ?? "",
      limit
    );
    return usuarios;
  }
}
