import { Request } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  QueryParam,
  Req,
} from "routing-controllers";
import { inject, injectable } from "tsyringe";
import { Authorized } from "../decorators/Authorized";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import prisma from "../lib/prisma";
import { AgendaInput, AgendaService } from "../services/agenda.service";

@injectable()
@Controller("/agenda")
export class AgendaController {
  constructor(@inject(AgendaService) private service: AgendaService) {}

  @Post("/")
  @Authorized()
  async create(@Body() body: any, @Req() req: Request) {
    let data = {
      ...body,
      usuarioSistemaId: req.user?.uid,
    } as AgendaInput;

    const agenda = await this.service.create(data);
    return agenda;
  }

  @Get("/:id")
  @Authorized()
  async findById(@Param("id") id: string) {
    const agenda = await this.service.findById(id);
    if (!agenda) {
      throw new Error("Agenda não encontrada");
    }
    return nonEmptyAndConvertDataDTO(agenda, {
      dateOptions: {
        hour: "2-digit",
        minute: "2-digit",
      },
    });
  }

  @Get("/")
  @Authorized()
  async getAll(
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10,
    @Req() req: Request
  ) {
    const { data, total } = await this.service.getAll({
      pageSize,
      page,
      user: req.user,
    });
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  @Put("/:id")
  @Authorized()
  async update(@Param("id") id: string, @Body() data: any) {
    const agenda = await prisma.agenda.update({
      where: { id },
      data: {
        dataHora: data.dataHora,
        link: data.link,
        tipoEvento: data.tipoEvento,
        localizacaoId: data.localizacaoId,
        vagaId: data.vagaId,
        etapaAtualId: data.etapaAtualId,
      },
    });
    return agenda;
  }

  @Delete("/:id")
  @Authorized()
  async delete(@Param("id") id: string) {
    await prisma.agenda.delete({
      where: { id },
    });
    return { message: "Agenda deletada com sucesso" };
  }
}
