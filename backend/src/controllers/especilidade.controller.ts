import { injectable } from "tsyringe";
import { Controller, Get, Post, Put, Delete, Param, Body } from "routing-controllers";
import { Authorized } from "../decorators/Authorized";
import prisma from "../lib/prisma";

@injectable()
@Controller("/especialidade")
export class EspecialidadeController {
  @Get("/")
  @Authorized()
  async listarEspecialidades() {
    const especialidades = await prisma.especialidade.findMany();
    return especialidades;
  }

  @Get("/:id")
  @Authorized()
  async buscarEspecialidadePorId(@Param("id") id: string) {
    const especialidade = await prisma.especialidade.findUnique({
      where: { id: Number(id) },
    });
    if (!especialidade) {
      throw new Error("Especialidade não encontrada.");
    }
    return especialidade;
  }

  @Post("/")
  @Authorized()
  async criarEspecialidade(@Body() body: { nome: string; sigla: string }) {
    const { nome, sigla } = body;
    const novaEspecialidade = await prisma.especialidade.create({
      data: { nome, sigla },
    });
    return novaEspecialidade;
  }

  @Put("/:id")
  @Authorized()
  async atualizarEspecialidade(
    @Param("id") id: string,
    @Body() body: { nome: string; sigla: string }
  ) {
    const { nome, sigla } = body;
    const especialidadeAtualizada = await prisma.especialidade.update({
      where: { id: Number(id) },
      data: { nome, sigla },
    });
    return especialidadeAtualizada;
  }

  @Delete("/:id")
  @Authorized()
  async removerEspecialidade(@Param("id") id: string) {
    await prisma.especialidade.delete({ where: { id: Number(id) } });
    return { message: "Especialidade removida com sucesso" };
  }
}
