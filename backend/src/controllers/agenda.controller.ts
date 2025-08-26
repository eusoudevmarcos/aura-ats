import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { AgendaInput, AgendaService } from "../services/agenda.service";

@injectable()
export class AgendaController {
  constructor(@inject(AgendaService) private service: AgendaService) {}

  // Cria um novo evento de agenda para uma vaga
  async create(req: Request, res: Response) {
    try {
      const data = req.body as AgendaInput;
      const agenda = await this.service.create(data);
      return res.status(201).json(agenda);
    } catch (error: any) {
      console.error("Erro ao criar agenda:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao criar agenda",
        error,
      });
    }
  }

  // Busca um evento de agenda por ID
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const agenda = await prisma.agendaVaga.findUnique({
        where: { id },
        include: {
          vaga: true,
          localizacao: true,
          etapaAtual: true,
        },
      });
      if (!agenda)
        return res.status(404).json({ message: "Agenda não encontrada" });
      return res.json(agenda);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar agenda", error });
    }
  }

  // Lista todos os eventos de agenda com paginação
  async getAll(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 10;

    try {
      const skip = (page - 1) * pageSize;
      const [agendas, total] = await Promise.all([
        prisma.agendaVaga.findMany({
          skip,
          take: pageSize,
          include: {
            vaga: true,
            localizacao: true,
            etapaAtual: true,
          },
          orderBy: { dataHora: "asc" },
        }),
        prisma.agendaVaga.count(),
      ]);
      return res.status(200).json({
        data: agendas,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      });
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao buscar agendas",
        message: error.message,
      });
    }
  }

  // Atualiza um evento de agenda
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const agenda = await prisma.agendaVaga.update({
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
      return res.status(200).json(agenda);
    } catch (error: any) {
      console.error("Erro ao atualizar agenda:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao atualizar agenda",
        error,
      });
    }
  }

  // Remove um evento de agenda
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.agendaVaga.delete({
        where: { id },
      });
      return res.status(204).send();
    } catch (error: any) {
      console.error("Erro ao deletar agenda:", error);
      return res.status(500).json({
        message: error?.message || "Erro ao deletar agenda",
        error,
      });
    }
  }
}
