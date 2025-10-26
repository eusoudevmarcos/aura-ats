import { Plano, PlanoAssinatura, Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
import { createPixPayment } from "../lib/mercadopago";

@injectable()
export class BillingService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Cria uma assinatura para planos do tipo MENSAL
   */
  async createAssinaturaMensal(data: {
    clienteId: string;
    planoId: string;
    valorPago?: number | string;
    detalhes?: string | null;
    dataExpiracao?: Date | null;
  }) {
    // Busca informações do Plano pelo ID
    const plano = await this.prisma.plano.findUnique({
      where: { id: data.planoId },
    });

    if (!plano) {
      throw new Error("Plano não encontrado");
    }
    if (plano.tipo !== "MENSAL") {
      throw new Error("O plano informado não é do tipo assinatura mensal");
    }

    // Cria o registro de assinatura
    // Calcula a data de expiração para 30 dias corridos a partir de agora, incluindo hora e minutos
    const now = new Date();
    const dataExpiracao = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const planoAssinatura = await this.prisma.planoAssinatura.create({
      data: {
        clienteId: data.clienteId,
        planoId: data.planoId,
        valorPago:
          data.valorPago !== undefined
            ? new Prisma.Decimal(data.valorPago)
            : plano.preco,
        detalhes: data.detalhes ?? null,
        dataExpiracao: dataExpiracao,
        usosDisponiveis: null,
        usosConsumidos: 0,
      },
    });

    if (!planoAssinatura.id) {
      throw new Error("Pagamento não pode ser processado");
    }

    // Ajusta o valor para pagamento PIX
    const payment = await createPixPayment({
      amount: Number(planoAssinatura.valorPago),
      email: "cliente@example.com",
      externalReference: planoAssinatura.id,
      description: `Assinatura do plano mensal: ${plano.nome}`,
      firstName: "João",
      lastName: "Silva",
      cpf: "12345678900",
    });

    return {
      planoAssinatura,
      payment,
    };
  }

  /**
   * Cria uma compra para planos do tipo POR_USO (compra de créditos de uso)
   */
  async createPlanoPorUso(data: {
    clienteId: string;
    planoId: string;
    valorPago?: number | string;
    detalhes?: string | null;
    usosDisponiveis?: number | null; // Quantidade de usos contratados
    dataExpiracao?: Date | null;
  }) {
    // Busca informações do Plano pelo ID
    const plano = await this.prisma.plano.findUnique({
      where: { id: data.planoId },
    });

    if (!plano) {
      throw new Error("Plano não encontrado");
    }
    if (plano.tipo !== "POR_USO") {
      throw new Error("O plano informado não é do tipo por uso");
    }

    // Define total de usos disponíveis (por padrão, pega do limite do plano)
    const usosDisponiveis = data.usosDisponiveis ?? plano.limiteUso ?? null;

    // Cria o registro de plano por uso (cada compra gera um novo registro)
    const planoAssinatura = await this.prisma.planoAssinatura.create({
      data: {
        clienteId: data.clienteId,
        planoId: data.planoId,
        valorPago:
          data.valorPago !== undefined
            ? new Prisma.Decimal(data.valorPago)
            : plano.preco,
        detalhes: data.detalhes ?? null,
        dataExpiracao: data.dataExpiracao ?? null,
        usosDisponiveis,
        usosConsumidos: 0,
      },
    });

    if (!planoAssinatura.id) {
      throw new Error("Pagamento não pode ser processado");
    }

    // Ajusta o valor para pagamento PIX
    const payment = await createPixPayment({
      amount: Number(planoAssinatura.valorPago),
      email: "cliente@example.com",
      externalReference: planoAssinatura.id,
      description: `Compra de créditos de uso do plano: ${plano.nome}`,
      firstName: "João",
      lastName: "Silva",
      cpf: "12345678900",
    });

    return {
      planoAssinatura,
      payment,
    };
  }

  // Busca assinatura por ID (PlanoAssinatura)
  async getByIdPlanoAssinatura(id: string): Promise<PlanoAssinatura | null> {
    return await this.prisma.planoAssinatura.findUnique({
      where: { id },
    });
  }

  // Busca todos os planos com paginação
  async getAll(
    page = 1,
    pageSize = 10
  ): Promise<{ data: Plano[]; total: number; page: number; pageSize: number }> {
    const [data, total] = await Promise.all([
      this.prisma.plano.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.plano.count(),
    ]);

    return { data, total, page, pageSize };
  }

  // Atualiza um plano existente usando schema do Prisma
  async update(
    id: string,
    data: Partial<Omit<Plano, "id" | "createdAt" | "updatedAt">>
  ): Promise<Plano | null> {
    return await this.prisma.plano.update({
      where: { id },
      data: {
        ...data,
        preco:
          data.preco !== undefined ? new Prisma.Decimal(data.preco) : undefined,
        updatedAt: new Date(),
      },
    });
  }

  // Deleta um plano por ID
  async delete(id: string): Promise<void> {
    await this.prisma.plano.delete({
      where: { id },
    });
  }

  /**
   * Debita um uso do plano do cliente logado
   */
  async debitarUsoCliente(
    clienteId: string,
    acao: string = "consulta_profissional"
  ): Promise<boolean> {
    try {
      // Busca planos ativos do cliente que têm limite de uso
      const planosAtivos = await this.prisma.planoAssinatura.findMany({
        where: {
          clienteId,
          status: "ATIVA",
          usosDisponiveis: {
            gt: 0,
          },
        },
        include: {
          plano: true,
        },
        orderBy: {
          dataAssinatura: "asc", // Prioriza planos mais antigos
        },
      });

      if (planosAtivos.length === 0) {
        throw new Error("Nenhum plano ativo com usos disponíveis encontrado");
      }

      // Pega o primeiro plano com usos disponíveis
      const planoParaDebitar = planosAtivos[0];

      // Debita um uso
      await this.prisma.planoAssinatura.update({
        where: { id: planoParaDebitar.id },
        data: {
          usosDisponiveis: planoParaDebitar.usosDisponiveis! - 1,
          usosConsumidos: (planoParaDebitar.usosConsumidos || 0) + 1,
        },
      });

      // Registra o uso no PlanoUso
      await this.prisma.planoUso.create({
        data: {
          planoAssinaturaId: planoParaDebitar.id,
          acao,
          dataUso: new Date(),
        },
      });

      return true;
    } catch (error) {
      console.error("Erro ao debitar uso:", error);
      return false;
    }
  }

  /**
   * Busca planos do cliente logado
   */
  async getPlanosUsuario(clienteId: string) {
    const planos = await this.prisma.planoAssinatura.findMany({
      where: { clienteId },
      include: {
        plano: true,
      },
      orderBy: {
        dataAssinatura: "desc",
      },
    });

    return planos.map((planoAssinatura) => ({
      id: planoAssinatura.id,
      nome: planoAssinatura.plano.nome,
      tipo: planoAssinatura.plano.tipo,
      limiteUso: planoAssinatura.plano.limiteUso,
      usosDisponiveis: planoAssinatura.usosDisponiveis,
      usosConsumidos: planoAssinatura.usosConsumidos,
      status: planoAssinatura.status,
      dataAssinatura: planoAssinatura.dataAssinatura,
      dataExpiracao: planoAssinatura.dataExpiracao,
    }));
  }
}
