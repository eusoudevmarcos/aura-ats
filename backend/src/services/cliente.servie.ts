import { Cliente, Prisma, StatusCliente } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import { buildClienteData } from "../helper/buildNested/cliente.build";
import { buildWhere } from "../helper/buildWhere";
import { normalizeClienteData } from "../helper/normalize/cliente.normalize";
import { validateBasicFieldsCliente } from "../helper/validate/cliente.validate";
import prisma from "../lib/prisma";
import { Pagination } from "../types/pagination";
import { UsuarioSistemaService } from "./usuarioSistema.service";

@injectable()
export class ClienteService {
  constructor(
    @inject(UsuarioSistemaService)
    private usuarioSistemaService: UsuarioSistemaService
  ) {}

  async getClienteById(id: string): Promise<any> {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      select: {
        id: true,
        emails: true,
        telefones: true,
        status: true,
        vagas: {
          select: {
            id: true,
          },
        },
        planos: {
          select: {
            id: true,
            dataAssinatura: true,
            status: true,
            usosConsumidos: true,
            planoId: true,
            qtdVagas: true,
            precoPersonalizado: true,
            porcentagemMinima: true,
            observacoes: true,
            plano: {
              select: {
                nome: true,
                tipo: true,
                categoria: true,
                limiteUso: true,
                preco: true,
              },
            },
          },
        },
        empresa: {
          select: {
            cnpj: true,
            dataAbertura: true,
            id: true,
            nomeFantasia: true,
            razaoSocial: true,
            representantes: {
              select: {
                id: true,
                nome: true,
                cpf: true,
                rg: true,
                dataNascimento: true,
                signo: true,
                sexo: true,
                empresaRepresentadaId: true,
              },
            },
            socios: true,
          },
        },
        usuarioSistema: true,
      },
    });

    if (!cliente) return null;

    const vagasCount = cliente.vagas ? cliente.vagas.length : 0;

    // Buscar planos separadamente
    // const planos = await prisma.planoAssinatura.findMany({
    //   where: { clienteId: id },
    //   include: {
    //     plano: true,
    //   },
    // });

    return {
      ...cliente,
      vagas: { _count: vagasCount },
      // planos,
    };
  }

  async getAll({ page = 1, pageSize = 10, search }: Pagination<any>) {
    const skip = (page - 1) * pageSize;

    if (search && search.includes(`@`) && typeof search == "string") {
      const usuariosSistemas = await prisma.usuarioSistema.findMany({
        where: { email: { contains: search, mode: "insensitive" } },
      });
      search = usuariosSistemas.map(({ clienteId }) => clienteId);
    }

    let where = buildWhere<Prisma.ClienteWhereInput>({
      search,
      fields: ["id", "empresa.razaoSocial", "empresa.cnpj"],
    });

    const [vagas, total] = await prisma.$transaction([
      prisma.cliente.findMany({
        skip,
        take: pageSize,
        orderBy: {
          empresa: {
            createdAt: "desc",
          },
        },
        where: where,
        select: {
          _count: true,
          id: true,
          status: true,
          vagas: {
            select: {
              _count: true,
            },
          },
          empresa: {
            select: {
              id: true,
              razaoSocial: true,
              cnpj: true,
              dataAbertura: true,
              nomeFantasia: true,
            },
          },
          usuarioSistema: {
            select: {
              email: true,
            },
          },
          planos: true,
        },
      }),
      prisma.cliente.count({ where }),
    ]);

    return {
      data: vagas,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Retorna os clientes em formato Kanban (por status), similar ao getAll de vagas.
   * Suporta paginação por lane/status individualmente via lanesPagination.
   */
  async getAllKanban({
    page = 1,
    pageSize = 10, // ignora para uso global, usa pageSize por lane (default 5)
    lanesPagination = {},
    search = "",
    ...rest
  }: Pagination<any> & {
    lanesPagination?: Partial<
      Record<StatusCliente, { page: number; pageSize: number }>
    >;
  } & Record<string, any>) {
    // Enum StatusCliente do Prisma, garanta import:
    // import { StatusCliente, Prisma } from "@prisma/client";
    const allStatuses: StatusCliente[] = [
      "PROSPECT",
      "LEAD",
      "ATIVO",
      "INATIVO",
      "PENDENTE",
    ];

    // Monta filtro base (sem status, handled por lane)
    let baseWhere = buildWhere<Prisma.ClienteWhereInput>({
      search,
      fields: ["id", "empresa.razaoSocial", "empresa.cnpj"],
    });

    // Busca por email do usuarioSistema, igual original
    let searchClienteIds: string[] | undefined = undefined;
    if (search && typeof search === "string" && search.includes("@")) {
      const usuariosSistemas = await prisma.usuarioSistema.findMany({
        where: { email: { contains: search, mode: "insensitive" } },
        select: { clienteId: true },
      });
      searchClienteIds = usuariosSistemas
        .map(({ clienteId }) => clienteId)
        .filter(Boolean) as string[];
    }
    if (searchClienteIds && searchClienteIds.length) {
      baseWhere = { ...baseWhere, id: { in: searchClienteIds } };
    }

    // Select padrão para o front (ajuste conforme necessidade)
    const select = {
      id: true,
      status: true,
      empresa: {
        select: {
          id: true,
          razaoSocial: true,
          cnpj: true,
          dataAbertura: true,
          nomeFantasia: true,
        },
      },
      usuarioSistema: {
        select: { email: true },
      },
      vagas: {
        select: { id: true },
      },
      planos: true,
    };

    // Monta para cada status uma consulta paginada
    // lanesPagination pode informar paging customizado para lanes
    const lanesQueries = allStatuses.map((status) => {
      const lanePaging = (lanesPagination as any)?.[status] || {
        page: 1,
        pageSize: 5,
      };
      const skip = (lanePaging.page - 1) * lanePaging.pageSize;
      const laneWhere: Prisma.ClienteWhereInput = {
        ...baseWhere,
        status: status,
      };
      return {
        status,
        findMany: prisma.cliente.findMany({
          where: laneWhere,
          orderBy: {
            empresa: {
              createdAt: "desc",
            },
          },
          skip,
          take: lanePaging.pageSize,
          select,
        }),
        count: prisma.cliente.count({
          where: laneWhere,
        }),
        paging: lanePaging,
      };
    });

    // Executa todas as queries em uma transação só
    const transactionCalls = [
      ...lanesQueries.flatMap(({ findMany, count }) => [findMany, count]),
    ];
    const results = await prisma.$transaction(transactionCalls);

    // Monta estrutura Kanban: 1 lane por status
    const lanes = allStatuses.map((status, idx) => {
      const laneQuery = lanesQueries[idx];
      const clientesDoStatus = results[idx * 2] as any[];
      const totalStatus = results[idx * 2 + 1] as number;
      const paging = laneQuery.paging;

      // Cards Kanban para clientes
      const cards = clientesDoStatus.map((cliente) => ({
        id: cliente.id,
        title: cliente.empresa.razaoSocial,
        label: cliente.empresa.cnpj,
        description: cliente.empresa.nomeFantasia || "",
        draggable: true,
        metadata: {
          dataAbertura: cliente.empresa.dataAbertura,
          email: cliente.usuarioSistema?.email,
          totalVagas: cliente.vagas ? cliente.vagas.length : 0,
          status: cliente.status,
          planos: cliente.planos,
        },
      }));

      const label = `${
        (paging.page - 1) * paging.pageSize + cards.length
      }/${totalStatus}`;

      return {
        id: status,
        title: status,
        label,
        cards,
        page: paging.page,
        pageSize: paging.pageSize,
        total: totalStatus,
        totalPages: Math.ceil(totalStatus / paging.pageSize),
        hasMore: paging.page * paging.pageSize < totalStatus,
      };
    });

    // Soma total global
    const total = lanes.reduce((acc, lane) => acc + lane.total, 0);

    return {
      lanes,
      total,
      page: 1,
      pageSize: 5,
      totalPages: 1,
    };
  }

  async save(clienteData: any): Promise<Cliente> {
    await validateBasicFieldsCliente(clienteData);

    const normalizedData = normalizeClienteData(clienteData);

    const clientePayload = await buildClienteData(normalizedData);

    const relations = {
      empresa: {
        include: {
          representantes: true,
          socios: true,
        },
      },
      usuarioSistema: true,
    };

    let cliente: Cliente;

    if (clienteData.id) {
      cliente = await prisma.cliente.update({
        where: { id: clienteData.id },
        data: clientePayload,
        include: relations,
      });
    } else {
      cliente = await prisma.cliente.create({
        data: clientePayload,
        include: relations,
      });
    }

    // if (clienteData.planos && Array.isArray(clienteData.planos)) {
    //   await this.managePlanos(cliente.id, clienteData.planos);
    // }

    // if (clienteData.email) {
    //   const usuarioSistemaData = {
    //     email: clienteData.email,
    //     clienteId: cliente.id,
    //     tipoUsuario: "CLIENTE",
    //     password: clienteData.password || "",
    //   };

    //   usuarioSistemaData.password =
    //     `${clienteData.empresa.nomeFantasia?.split(" ")[0]}${123}` ||
    //     generateRandomPassword();

    //   await this.usuarioSistemaService.save(usuarioSistemaData);

    //   const emaiLService = new EmailService();

    //   await emaiLService.sendUsuarioSistemaEmail(cliente, usuarioSistemaData);
    // }

    const clienteAtualizado = await this.getClienteById(cliente.id);
    if (!clienteAtualizado) {
      throw new Error("Erro ao buscar cliente atualizado");
    }
    return clienteAtualizado;
  }

  async delete(clienteId: string | undefined): Promise<boolean> {
    if (!clienteId) return false;

    return !!(await prisma.cliente.delete({
      where: { id: clienteId },
    }));
  }

  async updateStatus(vagaId: string, status: StatusCliente): Promise<boolean> {
    const statusAtualizado = await prisma.cliente.update({
      where: { id: vagaId },
      data: {
        status,
      },
    });
    return statusAtualizado ? true : false;
  }
}
