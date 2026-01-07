import { inject, injectable } from "tsyringe";
import { Controller, Get, Post, Delete, Param, Body, QueryParam } from "routing-controllers";
import { toUsuarioDTO } from "../dto/funcionario.dto";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import { UsuarioSistemaService } from "../services/usuarioSistema.service";
import { Authorized } from "../decorators/Authorized";

@injectable()
@Controller("/funcionario")
export class FuncionarioController {
  constructor(
    @inject(UsuarioSistemaService) private service: UsuarioSistemaService
  ) {}

  @Get("/")
  @Authorized()
  async getAll(
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10
  ) {
    const funcionario = await this.service.getAll(page, pageSize);
    return funcionario;
  }

  @Get("/:uid")
  @Authorized()
  async getById(@Param("uid") uid: string) {
    const funcionario = await this.service.getById(uid);
    return toUsuarioDTO(funcionario);
  }

  @Post("/save")
  async save(@Body() body: any) {
    const funcionario = await this.service.save(body);
    return nonEmptyAndConvertDataDTO(funcionario);
  }

  @Post("/create/pessoa")
  async createPessoa(@Body() body: any) {
    const funcionario = await this.service.save(body);
    return funcionario;
  }

  @Post("/create/empresa")
  @Authorized()
  async createEmpresa(@Body() body: any) {
    const funcionario = await this.service.save(body);
    return funcionario;
  }

  @Delete("/delete")
  @Authorized()
  async delete(@Body() body: { id: string }) {
    const { id } = body;
    await this.service.delete(id);
    return { message: "Usuario do sistema deletado com sucesso" };
  }
}
