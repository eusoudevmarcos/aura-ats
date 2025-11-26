import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import { ClienteService } from "../services/cliente.servie";

@injectable()
export class ClienteController {
  constructor(@inject(ClienteService) private service: ClienteService) {}

  async save(req: Request, res: Response) {
    try {
      const response = await this.service.save(req.body);
      return res.status(201).json(nonEmptyAndConvertDataDTO(response));
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || "Erro ao salvar cliente", error });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await this.service.getClienteById(id);

      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      const { planos, ...rest } = cliente;

      const planosUpdate = planos.map((planoAssinado: any) => ({
        ...planoAssinado,
        porcentagemMinima: Number(planoAssinado.porcentagemMinima.toString()),
      }));

      return res
        .status(200)
        .json(nonEmptyAndConvertDataDTO({ ...rest, planos: planosUpdate }));
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao buscar cliente", error });
    }
  }

  async getAll(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 10;

    const search = req.query.search;

    try {
      const clientes = await this.service.getAll({ page, pageSize, search });

      return res.status(200).json(clientes);
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao buscar cliente",
        message: error.message,
      });
    }
  }

  async getAllProspects(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 10;
    let search = req.query.search;
    search = { status: "PROSPECT" };

    try {
      const clientes = await this.service.getAll({ page, pageSize, search });

      return res.status(200).json(clientes);
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao buscar prospects",
        message: error.message,
      });
    }
  }
}
