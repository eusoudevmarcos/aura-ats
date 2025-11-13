// src/controllers/candidato.controller.ts
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import { CandidatoService } from "../services/candidato.service";

@injectable()
export class CandidatoController {
  constructor(
    @inject(CandidatoService) private candidatoService: CandidatoService
  ) {}

  async saveCandidato(req: Request, res: Response): Promise<Response> {
    try {
      const candidatoData = req.body;
      const newCandidato = await this.candidatoService.save(candidatoData);
      return res.status(201).json(newCandidato);
    } catch (error: any) {
      console.error("Erro ao criar candidato:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  // async updateCandidato(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const { id } = req.params;
  //     const candidatoData = { ...req.body, id };
  //     const updatedCandidato = await this.candidatoService.save(candidatoData);
  //     return res.status(200).json(updatedCandidato);
  //   } catch (error: any) {
  //     console.error("Erro ao atualizar candidato:", error.message);
  //     return res.status(400).json({ message: error.message });
  //   }
  // }

  async getCandidatoById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const clienteId = (req as any).user?.clienteId; // ID do cliente logado
      const candidato = await this.candidatoService.getCandidatoById(
        id,
        clienteId
      );
      if (!candidato) {
        return res.status(404).json({ message: "Candidato não encontrado." });
      }
      return res.status(200).json(nonEmptyAndConvertDataDTO(candidato));
    } catch (error: any) {
      console.error("Erro ao buscar candidato por ID:", error.message);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  async getAllCandidatos(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await this.candidatoService.getAllCandidatos(
        page,
        pageSize
      );
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Erro ao listar candidatos:", error.message);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  async deleteCandidato(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.candidatoService.deleteCandidato(id);
      return res.status(204).send();
    } catch (error: any) {
      console.error("Erro ao deletar candidato:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  async getEspecialidades(_: Request, res: Response) {
    try {
      const especialidades = await this.candidatoService.getEspecialidades();
      return res.status(200).send(especialidades);
    } catch (error: any) {
      console.error("Erro ao consultar especialidades:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  async downloadAnexo(req: Request, res: Response): Promise<Response | void> {
    try {
      const { anexoId } = req.params;
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
    } catch (error: any) {
      console.error("Erro ao fazer download do anexo:", error.message);
      return res.status(404).json({ message: error.message });
    }
  }
}
