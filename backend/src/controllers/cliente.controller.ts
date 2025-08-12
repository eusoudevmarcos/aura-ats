import prisma from "../lib/prisma";
import { Request, Response } from "express";

export class ClienteController {
  async save(req: Request, res: Response) {
    try {
      const { id } = req.params as { id?: string }; // 'id' do Cliente, se estiver atualizando
      const body = req.body as any;

      // --- Validações de Negócio ---
      if (!body.empresa && !body.empresaId) {
        throw new Error("Dados da empresa são obrigatórios para um cliente.");
      }

      // Se estamos criando uma NOVA empresa para um NOVO cliente, ela precisa de representante.
      if (!id && !body.empresa.representante[0]) {
        throw new Error(
          "Ao criar uma nova empresa para o cliente, é obrigatório informar pelo menos um representante."
        );
      }

      let empresaIdToConnect: string; // Vai armazenar o ID da empresa para conectar ao Cliente

      // --- Lógica de Criação/Conexão da Empresa ---
      if (body.empresaId) {
        // Cenário 1: Conectando a uma empresa existente
        const existingEmpresa = await prisma.empresa.findUnique({
          where: { id: body.empresaId as string },
        });

        if (!existingEmpresa) {
          throw new Error(`Empresa com ID ${body.empresaId} não encontrada.`);
        }
        empresaIdToConnect = existingEmpresa.id;
      } else if (body.empresa) {
        let CNPJExiste = await prisma.empresa.findFirst({
          where: { cnpj: body.empresa.cnpj },
        });

        if (CNPJExiste) {
          empresaIdToConnect = CNPJExiste.id;
        } else {
          const newEmpresa = await prisma.empresa.create({
            data: {
              razaoSocial: body.empresa.razaoSocial,
              cnpj: body.empresa.cnpj,
              dataAbertura: body.empresa.dataAbertura
                ? new Date(body.empresa.dataAbertura)
                : undefined,
              contatos: body.empresa.contatos
                ? { create: body.empresa.contatos }
                : undefined,
              localizacoes: body.empresa.localizacoes
                ? { create: body.empresa.localizacoes }
                : undefined,
              representante: body.empresa.representante[0] // Já validamos que existe se for nova empresa
                ? {
                    create: body.empresa.representante.map((rep: any) => ({
                      nome: rep.nome,
                      cpf: rep.cpf,
                      dataNascimento: rep.dataNascimento
                        ? new Date(rep.dataNascimento)
                        : undefined,
                      rg: rep.rg,
                      estadoCivil: rep.estadoCivil,
                      contatos: rep.contatos
                        ? { create: rep.contatos }
                        : undefined,
                      localizacoes: rep.localizacoes
                        ? { create: rep.localizacoes }
                        : undefined,
                      // Note: empresaRepresentadaId será preenchido automaticamente pelo Prisma ao criar a relação inversa
                    })),
                  }
                : undefined, // undefined se não houver representante (já validado que existe para novas empresas)
            },
          });
          empresaIdToConnect = newEmpresa.id;
        }
      } else {
        // Isso não deve acontecer devido às validações iniciais, mas para segurança
        throw new Error("Informações da empresa inválidas.");
      }

      // --- Dados para Criação/Atualização do Cliente ---
      const clienteData: any = {
        status: body.status,
        tipoServico: body.tipoServico,
        empresa: {
          connect: { id: empresaIdToConnect }, // Conectando o Cliente à Empresa
        },
      };

      const include = {
        empresa: {
          include: {
            contatos: true,
            localizacoes: true,
            representante: true,
          },
        },
      } as const;

      let result;
      if (id) {
        // Atualizando um Cliente existente
        result = await prisma.cliente.update({
          where: { id },
          data: clienteData,
          include,
        });
      } else {
        // Criando um novo Cliente
        // Antes de criar, verificar se já existe um cliente para esta empresa
        const existingClienteForEmpresa = await prisma.cliente.findUnique({
          where: { empresaId: empresaIdToConnect },
        });

        if (existingClienteForEmpresa) {
          throw new Error(
            `Já existe um cliente associado à empresa com ID: ${empresaIdToConnect}`
          );
        }

        result = await prisma.cliente.create({
          data: clienteData,
          include,
        });
      }

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Erro no método save do ClienteController:", error);
      return res
        .status(500)
        .json({ message: error?.message || "Erro ao salvar cliente", error });
    }
  }

  // ... (findById e getAll permanecem inalterados, pois já estavam corretos)
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await prisma.cliente.findUnique({
        where: { id },
        include: {
          empresa: {
            include: {
              contatos: true,
              localizacoes: true,
              representante: true,
            },
          },
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
          include: { empresa: { include: { representante: true } } },
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
