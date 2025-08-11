import prisma from "../lib/prisma";
import { Request, Response } from "express";

export class ClienteController {
  // Cria ou atualiza (save) com base na presença de id em params
  async save(req: Request, res: Response) {
    try {
      const { id } = req.params as { id?: string };
      const body = req.body as any;

      const CNPJExiste = await prisma.empresa.findFirst({
        where: { cnpj: body.empresa.cnpj },
      });

      if (!!CNPJExiste) {
        throw new Error("CNPJ já cadastrado");
      }

      const empresaRelation = body.empresaId
        ? {
            connect: {
              id: body.empresaId as string,
            },
          }
        : body.empresa
        ? {
            create: {
              razaoSocial: body.empresa.razaoSocial,
              cnpj: body.empresa.cnpj,
              dataAbertura: body.empresa.dataAbertura
                ? new Date(body.empresa.dataAbertura)
                : undefined,
              contatos: body.empresa.contatos
                ? {
                    create: body.empresa.contatos,
                  }
                : undefined,
              localizacoes: body.empresa.localizacoes
                ? {
                    create: body.empresa.localizacoes,
                  }
                : undefined,
            },
          }
        : undefined;

      if (!empresaRelation) {
        return res.status(400);
      }

      const data = {
        status: body.status,
        tipoServico: body.tipoServico,
        /*profissional: body.profissionalId
          ? {
              connect: {
                id: body.profissionalId as string,
              },
            }
          : undefined,*/
        empresa: empresaRelation,
      };

      const include = {
        empresa: {
          include: {
            contatos: true,
            localizacoes: true,
          },
        },
        // profissional: true,
      } as const;

      const result = id
        ? await prisma.cliente.update({ where: { id }, data, include })
        : await prisma.cliente.create({ data, include });

      return res.status(200).json(result);
    } catch (error: any) {
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
          empresa: { include: { contatos: true, localizacoes: true } },
          profissional: true,
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
          include: { empresa: true },
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
