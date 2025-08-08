import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { FuncionarioService } from "../services/funcionario.service";

@injectable()
export class FuncionarioController {
  constructor(
    @inject(FuncionarioService) private service: FuncionarioService
  ) {}

  async createPessoa(req: Request, res: Response) {
    try {
      const funcionario = await this.service.createFuncionarioPessoa(req.body);
      return res.status(201).json(funcionario);
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao criar funcionário",
        message: error.message,
      });
    }
  }

  async createEmpresa(req: Request, res: Response) {
    try {
      const funcionario = await this.service.createFuncionarioEmpresa(req.body);
      return res.status(201).json(funcionario);
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao criar funcionário",
        message: error.message,
      });
    }
  }
}
