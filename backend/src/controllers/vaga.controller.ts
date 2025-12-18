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
      let token = "";
      const authHeader = req.headers.authorization;
      if (
        authHeader &&
        typeof authHeader === "string" &&
        authHeader.startsWith("Bearer ")
      ) {
        token = authHeader.replace(/^Bearer\s+/i, "");
      } else if (authHeader && typeof authHeader === "string") {
        // fallback: just use the string if no Bearer prefix
        token = authHeader;
      }
      const newVaga = await this.service.save(
        nonEmptyAndConvertDataDTO(vagaData),
        token
      );
      return res.status(201).json(newVaga);
    } catch (error: any) {
      console.log("Error creating vaga:", error);
      return res.status(500).json({ message: error.message, error: error });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const tipoUusuario = req.user?.tipo;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize as string, 10)
        : 10;
      const search = req.query.search as string;

      if (tipoUusuario === "CLIENTE_ATS" && req.user?.uid) {
        const vagas = await this.service.getAllByUsuario({
          page,
          pageSize,
          search,
          usuarioId: req.user?.uid,
        });

        return res.status(200).json(vagas);
      }

      const vagas = await this.service.getAll({
        page,
        pageSize,
        search,
      });
      return res.status(200).json(vagas);
    } catch (error: any) {
      console.log("Error fetching vagas:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  async getAllByClienteId(req: Request, res: Response): Promise<Response> {
    try {
      const clienteId = req.params.clienteId;
      if (!clienteId) throw "ID do cliente é obrigatorio";

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize as string, 10)
        : 10;
      const search = req.query.search as string;

      const vagas = await this.service.getAllByCliente(clienteId, {
        page,
        pageSize,
        search,
      });
      return res.status(200).json(nonEmptyAndConvertDataDTO(vagas));
    } catch (error: any) {
      console.log("Error fetching vagas:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  async getAllByCandidatoId(req: Request, res: Response): Promise<Response> {
    try {
      const candidatoId = req.params.candidatoId;
      if (!candidatoId) throw "ID do cliente é obrigatorio";

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize as string, 10)
        : 10;
      const search = req.query.search as string;

      const vagas = await this.service.getAllByCandidato(candidatoId, {
        page,
        pageSize,
        search,
      });
      return res.status(200).json(nonEmptyAndConvertDataDTO(vagas));
    } catch (error: any) {
      console.log("Error fetching vagas:", error);
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
      console.log("Error fetching vaga by ID:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
  async vincularCandidato(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const vaga = await this.service.vincularCandidatos(
        id,
        req.body.candidatos
      );
      return res.status(200).json(nonEmptyAndConvertDataDTO(vaga));
    } catch (error: any) {
      console.log("Error fetching vaga by ID:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      await this.service.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      console.log("Error deleting vaga:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
}
