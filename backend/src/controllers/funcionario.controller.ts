import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { toUsuarioDTO } from "../dto/funcionario.dto";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import { UsuarioSistemaService } from "../services/usuarioSistema.service";

@injectable()
export class FuncionarioController {
  constructor(
    @inject(UsuarioSistemaService) private service: UsuarioSistemaService
  ) {}

  async getAll(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 10;

    try {
      const funcionario = await this.service.getAll(page, pageSize);
      return res.status(200).json(funcionario);
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao buscar funcionários",
        message: error.message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const funcionario = await this.service.getById(req.params.uid as string);
      return res.status(200).json(toUsuarioDTO(funcionario));
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao buscar funcionários",
        message: error.message,
      });
    }
  }

  async save(req: Request, res: Response) {
    try {
      const funcionario = await this.service.save(req.body);
      return res.status(201).json(nonEmptyAndConvertDataDTO(funcionario));
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao criar funcionário",
        message: error.message,
      });
    }
  }

  async createPessoa(req: Request, res: Response) {
    try {
      const funcionario = await this.service.save(req.body);
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
      const funcionario = await this.service.save(req.body);
      return res.status(201).json(funcionario);
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao criar funcionário",
        message: error.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.body;
      await this.service.delete(id);
      return res.status(200).json("Usuario do sistema deletado com sucesso");
    } catch (error: any) {
      return res.status(400).json({
        error: "Erro ao criar funcionário",
        message: error.message,
      });
    }
  }
}
