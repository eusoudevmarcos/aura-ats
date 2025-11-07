import { Cliente, Prisma } from "@prisma/client";
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
    // @inject(EmpresaRepository) private empresaRepository: EmpresaRepository,
    @inject(UsuarioSistemaService)
    private usuarioSistemaService: UsuarioSistemaService
  ) {}

  async getClienteById(id: string): Promise<any> {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
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
            // contatos: true,
            // localizacoes: true,
            representantes: {
              select: {
                id: true,
                nome: true,
                cpf: true,
                rg: true,
                dataNascimento: true,
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

    // Buscar planos separadamente
    // const planos = await prisma.planoAssinatura.findMany({
    //   where: { clienteId: id },
    //   include: {
    //     plano: true,
    //   },
    // });

    return {
      ...cliente,
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

  async save(clienteData: any): Promise<Cliente> {
    await validateBasicFieldsCliente(clienteData);

    const normalizedData = normalizeClienteData(clienteData);

    const clientePayload = await buildClienteData(normalizedData);

    console.log("PAYLOAD");
    console.log(JSON.stringify(clientePayload));

    const relations = {
      empresa: {
        include: {
          contatos: true,
          localizacoes: true,
          representantes: true,
          socios: true,
        },
      },
      planos: true,
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
}
