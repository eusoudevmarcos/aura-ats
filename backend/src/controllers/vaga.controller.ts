// src/controllers/VagaController.ts
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import { VagaService } from "../services/vaga.service";

@injectable()
export class VagaController {
  constructor(@inject(VagaService) private service: VagaService) {}

  async save(req: Request, res: Response): Promise<Response> {
    try {
      const vagaData = req.body;
      const newVaga = await this.service.save(
        nonEmptyAndConvertDataDTO(vagaData)
      );
      return res.status(201).json(newVaga);
    } catch (error: any) {
      console.error("Error creating vaga:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize as string, 10)
        : 10;
      const search = req.query.search as string;
      const vagas = await this.service.getAll({ page, pageSize, search });
      return res.status(200).json(vagas);
    } catch (error: any) {
      console.error("Error fetching vagas:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const vaga = await this.service.getById(id);
      return res.status(200).json(nonEmptyAndConvertDataDTO(vaga));
    } catch (error: any) {
      console.error("Error fetching vaga by ID:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
}
