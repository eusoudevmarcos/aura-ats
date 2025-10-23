import { Cliente, Prisma } from "@prisma/client";
import nodemailer from "nodemailer";
import { inject, injectable } from "tsyringe";
import { BuildNestedOperation } from "../helper/buildNested/buildNestedOperation";
import { buildClienteData } from "../helper/buildNested/cliente.build";
import { buildWhere } from "../helper/buildWhere";
import { normalizeClienteData } from "../helper/normalize/cliente.normalize";
import { validateBasicFieldsCliente } from "../helper/validate/cliente.validate";
import prisma from "../lib/prisma";
import { EmpresaRepository } from "../repository/empresa.repository";
import { Pagination } from "../types/pagination";
import { UsuarioSistemaService } from "./usuarioSistema.service";

@injectable()
export class ClienteService extends BuildNestedOperation {
  constructor(
    @inject(EmpresaRepository) private empresaRepository: EmpresaRepository,
    @inject(UsuarioSistemaService)
    private usuarioSistemaService: UsuarioSistemaService
  ) {
    super();
  }

  async getClienteById(id: string): Promise<any> {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        empresa: {
          include: {
            contatos: true,
            localizacoes: true,
            representantes: true,
            socios: true,
          },
        },
        usuarioSistema: true,
        // vagas: {
        //   select: {
        //     id: true,
        //     titulo: true,
        //     categoria: true,
        //     dataPublicacao: true,
        //     status: true,
        //     _count: {
        //       select: {
        //         candidaturas: true,
        //       },
        //     },
        //   },
        // },
      },
    });

    if (!cliente) return null;

    // Buscar planos separadamente
    const planos = await prisma.planoAssinatura.findMany({
      where: { clienteId: id },
      include: {
        plano: true,
      },
    });

    return {
      ...cliente,
      planos,
    };
  }

  async getAll({ page = 1, pageSize = 10, search }: Pagination<any>) {
    const skip = (page - 1) * pageSize;

    if (search && typeof search === "string") {
      const onlyNumbers = search.replace(/[^0-9]/g, "");
      if (onlyNumbers.length >= 10) {
        search = onlyNumbers;
      }
    }

    if (search && (search.includes(`@`) || typeof search == "string")) {
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
            select: {
              email: true,
            },
          },
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
    validateBasicFieldsCliente(clienteData);

    const normalizedData = normalizeClienteData(clienteData);

    if (!clienteData.id) {
      await this.checkDuplicates(normalizedData);
    }

    const clientePayload = await buildClienteData(normalizedData);

    const relations = {
      empresa: {
        include: {
          contatos: true,
          localizacoes: true,
          representantes: true,
          socios: true,
        },
      },
      planos: {
        include: {
          plano: true,
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

    // Gerenciar planos se fornecidos
    if (clienteData.planos && Array.isArray(clienteData.planos)) {
      await this.managePlanos(cliente.id, clienteData.planos);
    }

    // Gerenciar usuarioSistema se fornecido
    if (clienteData.usuarioSistema) {
      const usuarioSistemaData = {
        ...clienteData.usuarioSistema,
        clienteId: cliente.id,
        tipoUsuario: "CLIENTE", // Sempre CLIENTE para clientes
      };

      // Se não tem senha, gera uma aleatória
      if (!usuarioSistemaData.password) {
        usuarioSistemaData.password = this.generateRandomPassword();
      }

      await this.usuarioSistemaService.save(usuarioSistemaData);

      // Enviar email com informações de login
      await this.sendLoginEmail(cliente, usuarioSistemaData);
    }

    // Buscar cliente atualizado com todas as relações
    const clienteAtualizado = await this.getClienteById(cliente.id);
    if (!clienteAtualizado) {
      throw new Error("Erro ao buscar cliente atualizado");
    }
    return clienteAtualizado;
  }

  private async checkDuplicates(data: any): Promise<void> {
    // Se tem empresaId, verificar se a empresa existe
    if (data.empresaId) {
      const empresaExistente = await prisma.empresa.findUnique({
        where: { id: data.empresaId },
      });

      if (!empresaExistente) {
        throw new Error(`Empresa com ID ${data.empresaId} não encontrada.`);
      }

      // Verificar se já existe cliente para essa empresa
      const clienteExistente = await prisma.cliente.findUnique({
        where: { empresaId: data.empresaId },
      });

      if (clienteExistente) {
        throw new Error(
          `Já existe um cliente associado à empresa com ID: ${data.empresaId}`
        );
      }
    }

    // Se tem dados da empresa para criar/atualizar
    if (data.empresa?.cnpj) {
      const empresaExistentePorCnpj = await prisma.empresa.findUnique({
        where: { cnpj: data.empresa.cnpj },
      });

      if (empresaExistentePorCnpj) {
        // Se a empresa existe, verificar se já tem cliente
        const clienteExistente = await prisma.cliente.findUnique({
          where: { empresaId: empresaExistentePorCnpj.id },
        });

        if (clienteExistente) {
          throw new Error(
            `Já existe um cliente para a empresa com CNPJ: ${data.empresa.cnpj}`
          );
        }
      }
    }
  }

  private generateRandomPassword(): string {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";

    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }

  private async managePlanos(
    clienteId: string,
    planos: string[]
  ): Promise<void> {
    // Remove planos existentes
    await prisma.planoAssinatura.deleteMany({
      where: { clienteId },
    });

    // Adiciona novos planos
    for (const planoId of planos) {
      await prisma.planoAssinatura.create({
        data: {
          clienteId,
          planoId,
          dataAssinatura: new Date(),
          status: "ATIVA",
          valorPago: 0, // Pode ser ajustado conforme necessário
        },
      });
    }
  }

  private async sendLoginEmail(
    cliente: any,
    usuarioSistemaData: any
  ): Promise<void> {
    try {
      // Configurar transporter de email (ajuste conforme sua configuração)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || "noreply@aura-ats.com",
        to: usuarioSistemaData.email,
        subject: "Bem-vindo ao Aura ATS - Suas credenciais de acesso",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Bem-vindo ao Aura ATS!</h2>
            <p>Olá,</p>
            <p>Seu cadastro foi realizado com sucesso! Aqui estão suas credenciais de acesso:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Email:</strong> ${usuarioSistemaData.email}</p>
              <p><strong>Senha:</strong> ${usuarioSistemaData.password}</p>
            </div>
            
            <p>Para acessar o sistema, clique no link abaixo:</p>
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/login" 
               style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Acessar Sistema
            </a>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              <strong>Importante:</strong> Por segurança, recomendamos que você altere sua senha no primeiro acesso.
            </p>
            
            <p style="color: #666; font-size: 14px;">
              Se você não solicitou este cadastro, ignore este email.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Email enviado com sucesso para:", usuarioSistemaData.email);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      // Não falha o processo se o email não for enviado
    }
  }
}
