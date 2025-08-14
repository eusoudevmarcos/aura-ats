// src/controllers/candidato.controller.ts
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { CandidatoService } from "../services/candidato.service";

@injectable()
export class CandidatoController {
  constructor(
    @inject(CandidatoService) private candidatoService: CandidatoService
  ) {}

  async createCandidato(req: Request, res: Response): Promise<Response> {
    try {
      const candidatoData = req.body;
      const newCandidato = await this.candidatoService.save(candidatoData);
      return res.status(201).json(newCandidato);
    } catch (error: any) {
      console.error("Erro ao criar candidato:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  async updateCandidato(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const candidatoData = { ...req.body, id };
      const updatedCandidato = await this.candidatoService.save(candidatoData);
      return res.status(200).json(updatedCandidato);
    } catch (error: any) {
      console.error("Erro ao atualizar candidato:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  async getCandidatoById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const candidato = await this.candidatoService.getCandidatoById(id);
      if (!candidato) {
        return res.status(404).json({ message: "Candidato não encontrado." });
      }
      return res.status(200).json(candidato);
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
}
