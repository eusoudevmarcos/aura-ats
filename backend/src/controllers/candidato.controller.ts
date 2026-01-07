// src/controllers/candidato.controller.ts
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Controller, Get, Post, Delete, Param, Body, QueryParam, Req, Res } from "routing-controllers";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import { saveLog } from "../lib/logger";
import { CandidatoService } from "../services/candidato.service";
import { Authorized } from "../decorators/Authorized";

@injectable()
@Controller("/candidato")
export class CandidatoController {
  constructor(
    @inject(CandidatoService) private candidatoService: CandidatoService
  ) {}

  @Post("/")
  @Authorized()
  async saveCandidato(@Body() candidatoData: any) {
    try {
      const newCandidato = await this.candidatoService.save(candidatoData);
      return nonEmptyAndConvertDataDTO(newCandidato);
    } catch (error: any) {
      await saveLog({
        type: "CADASTRO CANDIDATO",
        status: "error",
        data: error,
      });
      throw error;
    }
  }

  @Get("/especialidades")
  @Authorized()
  async getEspecialidades() {
    const especialidades = await this.candidatoService.getEspecialidades();
    return especialidades;
  }

  @Get("/anexo/:anexoId/download")
  @Authorized()
  async downloadAnexo(@Param("anexoId") anexoId: string, @Res() res: Response): Promise<void> {
    const filePath = await this.candidatoService.getFilePathForDownload(
      anexoId
    );

    const path = require("path");
    const fs = require("fs");

    const fileName = path.basename(filePath);
    const fileStream = fs.createReadStream(filePath);

    // Determina o content-type baseado na extensão
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes: { [key: string]: string } = {
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".txt": "text/plain",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";

    // Para PDFs, usar inline para visualização; para outros, attachment para download
    const disposition =
      ext === ".pdf"
        ? `inline; filename="${encodeURIComponent(fileName)}"`
        : `attachment; filename="${encodeURIComponent(fileName)}"`;

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", disposition);

    fileStream.pipe(res);
  }

  @Get("/")
  @Authorized()
  async getAllCandidatos(
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 10
  ) {
    const result = await this.candidatoService.getAllCandidatos(
      page,
      pageSize
    );
    return result;
  }

  @Get("/:id")
  @Authorized()
  async getCandidatoById(@Param("id") id: string, @Req() req: Request) {
    const clienteId = (req as any).user?.clienteId;
    const candidato = await this.candidatoService.getCandidatoById(
      id,
      clienteId
    );
    if (!candidato) {
      throw new Error("Candidato não encontrado.");
    }
    return nonEmptyAndConvertDataDTO(candidato);
  }

  @Delete("/")
  @Authorized()
  async deleteCandidato(@Body() body: { id: string }) {
    const { id } = body;
    await this.candidatoService.deleteCandidato(id);
    return { message: "Candidato deletado com sucesso" };
  }
}
