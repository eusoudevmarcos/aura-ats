import { Request, Response } from "express";
import ProfissionalService from "../services/profissional.service";
import { MedicoInput } from "../models/medico.model";
import { inject, injectable } from "tsyringe";

@injectable()
export class ProfissionalController {
  constructor(
    @inject(ProfissionalService)
    private profissionalService: ProfissionalService
  ) {}

  async get(req: Request, res: Response) {
    const id = req.query.id as string;
    try {
      const medico = await this.profissionalService.get(id);

      res.status(200).json(medico);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const body = req.body as Omit<MedicoInput, "id">;
    try {
      const medico = await this.profissionalService.create(body);

      res.status(200).json(medico);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    const body = req.body as MedicoInput & { id: string };
    try {
      const medico = await this.profissionalService.update(body.id, body);

      res.status(200).json(medico);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
