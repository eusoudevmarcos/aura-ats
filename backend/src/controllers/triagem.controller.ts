import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import { TriagemService } from "../services/triagem.service";

@injectable()
export class TriagemController {
  constructor(@inject(TriagemService) private service: TriagemService) {}

  async save(req: Request, res: Response) {
    try {
      const response = await this.service.save(req.body);
      return res.status(201).json(response);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || "Erro ao salvar triagem", error });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const triagem = await this.service.getTriagemById(id);

      if (!triagem) {
        return res.status(404).json({ message: "Triagem não encontrada" });
      }

      return res.status(200).json(nonEmptyAndConvertDataDTO(triagem));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar triagem", error });
    }
  }

  async getAll(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 10;

    const search = req.query.search;

    try {
      const triagens = await this.service.getAll({ page, pageSize, search });

      return res.status(200).json(triagens);
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao buscar triagens",
        message: error.message,
      });
    }
  }

  async getAllByVagaId(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 10;

    const search = req.query.search;
    const vagaId = req.params.vagaId;

    try {
      const triagens = await this.service.getAllByVagaId({
        page,
        pageSize,
        search,
        vagaId,
      });

      return res.status(200).json(triagens);
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao buscar triagens",
        message: error.message,
      });
    }
  }

  async getAllPendentes(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 10;
    let search = req.query.search;
    search = { status: "PENDENTE" };

    try {
      const triagens = await this.service.getAll({ page, pageSize, search });

      return res.status(200).json(triagens);
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao buscar triagens pendentes",
        message: error.message,
      });
    }
  }
}
