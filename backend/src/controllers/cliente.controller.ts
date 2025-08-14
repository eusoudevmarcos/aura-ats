import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { ClienteService } from "../services/cliente.servie";

@injectable()
export class ClienteController {
  constructor(@inject(ClienteService) private service: ClienteService) {}

  async save(req: Request, res: Response) {
    try {
      const response = await this.service.save(req.body);
      return res.status(200).json(response);
    } catch (error: any) {
      console.error("Erro no método save do ClienteController:", error);
      return res
        .status(500)
        .json({ message: error?.message || "Erro ao salvar cliente", error });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await prisma.cliente.findUnique({
        where: { id },
        include: {
          empresa: {
            include: {
              contatos: true,
              localizacoes: true,
              representantes: true,
            },
          },
        },
      });
      if (!result)
        return res.status(404).json({ message: "Cliente não encontrado" });
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar cliente", error });
    }
  }

  async getAll(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 10;

    try {
      const skip = (page - 1) * pageSize;
      const [clientes, total] = await Promise.all([
        await prisma.cliente.findMany({
          skip,
          take: pageSize,
          include: { empresa: { include: { representantes: true } } },
          orderBy: { id: "asc" },
        }),
        await prisma.cliente.count(),
      ]);
      return res.status(200).json({
        data: clientes,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      });
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao buscar funcionários",
        message: error.message,
      });
    }
  }
}
