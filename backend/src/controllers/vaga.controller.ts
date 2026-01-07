// src/controllers/VagaController.ts
import { Request } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  QueryParam,
  Req,
} from "routing-controllers";
import { inject, injectable } from "tsyringe";
import { Authorized } from "../decorators/Authorized";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import paginationBuild from "../helper/buildNested/paginationBuild";
import { VagaService } from "../services/vaga.service";
import { VagaGetAllQuery } from "../types/vaga.type";

@injectable()
@Controller("/vaga")
export class VagaController {
  constructor(@inject(VagaService) private service: VagaService) {}

  @Post("/")
  @Authorized()
  async save(@Body() vagaData: any, @Req() req: Request) {
    let token = "";
    const authHeader = req.headers.authorization;
    if (
      authHeader &&
      typeof authHeader === "string" &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.replace(/^Bearer\s+/i, "");
    } else if (authHeader && typeof authHeader === "string") {
      token = authHeader;
    }
    const newVaga = await this.service.save(
      nonEmptyAndConvertDataDTO(vagaData),
      token
    );
    return newVaga;
  }

  @Get("/")
  @Authorized()
  async getAll(
    @QueryParam("page", { required: false }) page: any,
    @QueryParam("pageSize", { required: false }) pageSize: any,
    @Req() req: Request
  ) {
    const serviceQuery = paginationBuild({
      page,
      pageSize,
      ...req.query,
    } as VagaGetAllQuery);
    const tipoUsuario = (req as any).user?.tipo;

    if (tipoUsuario === "CLIENTE_ATS" && (req as any).user?.uid) {
      const vagas = await this.service.getAllByUsuario({
        ...serviceQuery,
        usuarioId: (req as any).user?.uid,
      });
      return vagas;
    }

    const vagas = await this.service.getAll(serviceQuery);
    return vagas;
  }

  @Get("/kanban")
  @Authorized()
  async getAllKanban(
    @QueryParam("page", { required: false }) page: any,
    @QueryParam("pageSize", { required: false }) pageSize: any,
    @Req() req: Request
  ) {
    const serviceQuery = paginationBuild({
      page,
      pageSize,
      ...req.query,
    } as VagaGetAllQuery);
    const tipoUsuario = (req as any).user?.tipo;

    if (tipoUsuario === "CLIENTE_ATS" && (req as any).user?.uid) {
      const vagas = await this.service.getAllByUsuario({
        ...serviceQuery,
        usuarioId: (req as any).user?.uid,
      });
      return vagas;
    }

    const vagas = await this.service.getAll(serviceQuery);
    return vagas;
  }

  @Get("/cliente/:clienteId")
  @Authorized()
  async getAllByClienteId(
    @Param("clienteId") clienteId: string,
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10,
    @QueryParam("search", { required: false }) search: string = ""
  ) {
    if (!clienteId) throw new Error("ID do cliente é obrigatorio");

    const vagas = await this.service.getAllByCliente(clienteId, {
      page,
      pageSize,
      search,
    });
    return nonEmptyAndConvertDataDTO(vagas);
  }

  @Get("/candidato/:candidatoId")
  @Authorized()
  async getAllByCandidatoId(
    @Param("candidatoId") candidatoId: string,
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10,
    @QueryParam("search", { required: false }) search: string = ""
  ) {
    if (!candidatoId) throw new Error("ID do candidato é obrigatorio");

    const vagas = await this.service.getAllByCandidato(candidatoId, {
      page,
      pageSize,
      search,
    });
    return nonEmptyAndConvertDataDTO(vagas);
  }

  @Get("/:id/historico")
  @Authorized()
  async getHistoricoByVagaId(
    @Param("id") id: string,
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10
  ) {
    const [historico, vaga] = await Promise.all([
      this.service.getHistoricoByVagaId(id, { page, pageSize }),
      this.service.getById(id),
    ]);

    return {
      vaga: nonEmptyAndConvertDataDTO(vaga),
      historico: nonEmptyAndConvertDataDTO(historico),
    };
  }

  @Get("/:id")
  async getById(@Param("id") id: string) {
    const vaga = await this.service.getById(id);
    return nonEmptyAndConvertDataDTO(vaga);
  }

  @Post("/vincular-candidatos/:id")
  @Authorized()
  async vincularCandidato(
    @Param("id") id: string,
    @Body() body: { candidatos: any[] }
  ) {
    const vaga = await this.service.vincularCandidatos(id, body.candidatos);
    return nonEmptyAndConvertDataDTO(vaga);
  }

  @Delete("/:id")
  @Authorized()
  async delete(@Param("id") id: string) {
    await this.service.delete(id);
    return { message: "Vaga deletada com sucesso" };
  }

  @Patch("/status")
  @Authorized()
  async updateStatus(@Body() body: { status: string; id: string }) {
    const { status, id } = body;
    if (!status || !id) throw new Error("id e status são obrigatorio");

    const statusAtualizado = await this.service.updateStatus(id, status as any);
    return statusAtualizado;
  }
}
