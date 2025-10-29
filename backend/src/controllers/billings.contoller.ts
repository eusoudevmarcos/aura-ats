import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { BillingService } from "../services/billing.service";

@injectable()
export class BillingController {
  constructor(@inject(BillingService) private billingService: BillingService) {}

  // Cria assinatura para plano mensal
  async createAssinaturaMensal(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const result = await this.billingService.createAssinaturaMensal(data);
      return res.status(201).json(result);
    } catch (error: any) {
      console.error("Erro ao criar assinatura mensal:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  // Cria compra para plano por uso (plano único)
  async createPlanoPorUso(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const result = await this.billingService.createPlanoPorUso(data);
      return res.status(201).json(result);
    } catch (error: any) {
      console.error("Erro ao criar compra de plano por uso:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  // Busca assinatura/plano por uso (PlanoAssinatura) por ID
  async getByIdPlanoAssinatura(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const planoAssinatura = await this.billingService.getByIdPlanoAssinatura(
        id
      );
      if (!planoAssinatura) {
        return res
          .status(404)
          .json({ message: "Assinatura/Plano não encontrado." });
      }
      return res.status(200).json(planoAssinatura);
    } catch (error: any) {
      console.error("Erro ao obter assinatura/plano:", error.message);
      return res.status(500).json({ message: error.message });
    }
  }

  // Busca todos os planos (com paginação opcional)
  async getAllPlanos(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const result = await this.billingService.getAll(page, pageSize);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Erro ao listar planos:", error.message);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  // Atualiza um plano existente pelo ID
  async updatePlano(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedPlano = await this.billingService.update(id, data);
      return res.status(200).json(updatedPlano);
    } catch (error: any) {
      console.error("Erro ao atualizar plano:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  // Deleta um plano por ID
  async deletePlano(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.billingService.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      console.error("Erro ao deletar plano:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  // Debita um uso do plano do cliente logado
  async debitarUsoCliente(req: Request, res: Response): Promise<Response> {
    try {
      const clienteId = (req as any).user?.clienteId;
      if (!clienteId) {
        return res.status(401).json({ message: "Cliente não identificado" });
      }

      const { acao } = req.body;
      const sucesso = await this.billingService.debitarUsoCliente(
        clienteId,
        acao
      );

      if (sucesso) {
        return res.status(200).json({ message: "Uso debitado com sucesso" });
      } else {
        return res
          .status(400)
          .json({ message: "Não foi possível debitar o uso" });
      }
    } catch (error: any) {
      console.error("Erro ao debitar uso:", error.message);
      return res.status(500).json({ message: error.message });
    }
  }

  // Busca planos do cliente logado
  async getPlanosUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const clienteId = (req as any).user?.clienteId;
      if (!clienteId) {
        return res.status(401).json({ message: "Cliente não identificado" });
      }

      const planos = await this.billingService.getPlanosUsuario(clienteId);
      return res.status(200).json({ planos });
    } catch (error: any) {
      console.error("Erro ao buscar planos do usuário:", error.message);
      return res.status(500).json({ message: error.message });
    }
  }
}
