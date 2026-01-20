import { Request } from "express";
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req } from "routing-controllers";
import { inject, injectable } from "tsyringe";
import { Authorized } from "../decorators/Authorized";
import { BillingService } from "../services/billing.service";

@injectable()
@Controller("/planos")
export class BillingController {
  constructor(@inject(BillingService) private billingService: BillingService) {}

  @Post("/assinatura-mensal")
  async createAssinaturaMensal(@Body() data: any) {
    const result = await this.billingService.createAssinaturaMensal(data);
    return result;
  }

  @Post("/plano-por-uso")
  async createPlanoPorUso(@Body() data: any) {
    const result = await this.billingService.createPlanoPorUso(data);
    return result;
  }

  @Get("/plano-assinatura/:id")
  async getByIdPlanoAssinatura(@Param("id") id: string) {
    const planoAssinatura = await this.billingService.getByIdPlanoAssinatura(
      id
    );
    if (!planoAssinatura) {
      throw new Error("Assinatura/Plano não encontrado.");
    }
    return planoAssinatura;
  }

  @Get("/")
  async getAllPlanos(
    @QueryParam("page", { required: false }) page: number = 1,
    @QueryParam("pageSize", { required: false }) pageSize: number = 12
  ) {
    const result = await this.billingService.getAll(page, pageSize);
    return result;
  }

  @Put("/planos/:id")
  async updatePlano(@Param("id") id: string, @Body() data: any) {
    const updatedPlano = await this.billingService.update(id, data);
    return updatedPlano;
  }

  @Delete("/planos/:id")
  async deletePlano(@Param("id") id: string) {
    await this.billingService.delete(id);
    return { message: "Plano deletado com sucesso" };
  }

  @Post("/debitar-uso")
  @Authorized()
  async debitarUsoCliente(@Body() body: { acao: string }, @Req() req: Request) {
    const clienteId = (req as any).user?.clienteId;
    if (!clienteId) {
      throw new Error("Cliente não identificado");
    }

    const { acao } = body;
    const sucesso = await this.billingService.debitarUsoCliente(
      clienteId,
      acao
    );

    if (sucesso) {
      return { message: "Uso debitado com sucesso" };
    } else {
      throw new Error("Não foi possível debitar o uso");
    }
  }

  @Get("/planos-usuario")
  @Authorized()
  async getPlanosUsuario(@Req() req: Request) {
    const clienteId = (req as any).user?.clienteId;
    if (!clienteId) {
      throw new Error("Cliente não identificado");
    }

    const planos = await this.billingService.getPlanosUsuario(clienteId);
    return { planos };
  }
}
