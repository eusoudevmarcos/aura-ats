import { inject, injectable } from "tsyringe";
import { Controller, Get, Post, Param, QueryParam, Body } from "routing-controllers";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import { TriagemService } from "../services/triagem.service";
import { Authorized } from "../decorators/Authorized";

@injectable()
@Controller("/triagem")
export class TriagemController {
  constructor(@inject(TriagemService) private service: TriagemService) {}

  /**
   * Normaliza parâmetros de busca vindos da query string.
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

  @Post("/save")
  @Authorized()
  async save(@Body() body: any) {
    const response = await this.service.save(body);
    return response;
  }

  @Get("/pendentes")
  @Authorized()
  async getAllPendentes(
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10
  ) {
    const search = { status: "PENDENTE" };
    const triagens = await this.service.getAll({ page, pageSize, search });
    return triagens;
  }

  @Get("/")
  @Authorized()
  async getAll(
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10,
    @QueryParam("search", { required: false }) search?: string
  ) {
    const normalizedSearch = this.normalizeSearch(search);

    const triagens = await this.service.getAll({
      page,
      pageSize,
      search: normalizedSearch,
    });
    return triagens;
  }

  @Get("/vaga/:vagaId")
  @Authorized()
  async getAllByVagaId(
    @Param("vagaId") vagaId: string,
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10,
    @QueryParam("search", { required: false }) search?: string
  ) {
    const normalizedSearch = this.normalizeSearch(search);

    const triagens = await this.service.getAllByVagaId({
      page,
      pageSize,
      search: normalizedSearch,
      vagaId,
    });
    return triagens;
  }

  @Get("/:id")
  @Authorized()
  async findById(@Param("id") id: string) {
    const triagem = await this.service.getTriagemById(id);

    if (!triagem) {
      throw new Error("Triagem não encontrada");
    }

    return nonEmptyAndConvertDataDTO(triagem);
  }
}
