import { Request } from "express";
import { inject, injectable } from "tsyringe";
import { Controller, Get, Post, Put, Delete, Patch, Param, Body, QueryParam, Req } from "routing-controllers";
import { StatusCliente } from "@prisma/client";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import { ClienteService } from "../services/cliente.servie";
import { Authorized } from "../decorators/Authorized";

@injectable()
@Controller("/cliente")
export class ClienteController {
  constructor(@inject(ClienteService) private service: ClienteService) {}

  @Post("/save")
  @Authorized()
  async save(@Body() body: any) {
    const response = await this.service.save(body);
    return nonEmptyAndConvertDataDTO(response);
  }

  @Put("/save/:id")
  @Authorized()
  async update(@Param("id") id: string, @Body() body: any) {
    const response = await this.service.save({ ...body, id });
    return nonEmptyAndConvertDataDTO(response);
  }

  @Get("/")
  @Authorized()
  async getAll(
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10,
    @QueryParam("search", { required: false }) search: any
  ) {
    const clientes = await this.service.getAll({ page, pageSize, search });
    return clientes;
  }

  @Get("/kanban")
  @Authorized()
  async getAllKanban(
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10,
    @QueryParam("search", { required: false }) search: string = "",
    @Req() req: Request
  ) {
    const serviceQuery: any = {
      page,
      pageSize,
      search,
      ...(req.query as any),
    };

    const clientes = await this.service.getAll(serviceQuery);
    return nonEmptyAndConvertDataDTO(clientes);
  }

  @Get("/:id")
  @Authorized()
  async findById(@Param("id") id: string) {
    const cliente = await this.service.getClienteById(id);

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    const { planos, ...rest } = cliente;

    const planosUpdate = planos.map((planoAssinado: any) => ({
      ...planoAssinado,
      porcentagemMinima: Number(planoAssinado.porcentagemMinima.toString()),
    }));

    return nonEmptyAndConvertDataDTO({ ...rest, planos: planosUpdate });
  }

  @Get("/prospects")
  @Authorized()
  async getAllProspects(
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10
  ) {
    const search = { status: "PROSPECT" };
    const clientes = await this.service.getAll({ page, pageSize, search });
    return clientes;
  }

  @Delete("/")
  @Authorized()
  async delete(@Body() body: { id: string }) {
    const { id } = body;
    const response = await this.service.delete(id);
    return response;
  }

  @Patch("/status")
  @Authorized()
  async updateStatus(@Body() body: { status: string; id: string }) {
    const { status, id } = body;
    if (!status || !id) throw new Error("id e status são obrigatorio");

    const statusAtualizado = await this.service.updateStatus(id, status as StatusCliente);
    return statusAtualizado;
  }
}
