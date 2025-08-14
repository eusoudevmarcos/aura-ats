// src/repository/pessoa.repository.ts
import {
  Contato,
  Formacao,
  Localizacao,
  Pessoa,
  TipoSocio,
} from "@prisma/client";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma"; // Importe o prisma aqui

// Certifique-se de que os seus tipos PessoaCreateInput e PessoaUpdateInput estão corretos
export type PessoaCreateInput = Omit<
  Pessoa,
  "id" | "createdAt" | "updatedAt" | "empresaRepresentadaId" | "empresaId"
> & {
  contatos?: { create?: any[]; connect?: { id: string }[] };
  localizacoes?: { create?: any[]; connect?: { id: string }[] };
  formacoes?: { create?: any[] };
  socios?: { create?: any[] };
};

export type PessoaUpdateInput = Partial<
  Omit<
    Pessoa,
    "id" | "createdAt" | "updatedAt" | "empresaRepresentadaId" | "empresaId"
  >
> & {
  id: string; // ID é necessário para atualização
  contatos?: {
    create?: any[];
    connect?: { id: string }[];
    update?: any[];
    delete?: any[];
  };
  localizacoes?: {
    create?: any[];
    connect?: { id: string }[];
    update?: any[];
    delete?: any[];
  };
  formacoes?: { create?: any[]; update?: any[]; delete?: any[] };
  socios?: { create?: any[]; update?: any[]; delete?: any[] };
};

@injectable()
export class PessoaRepository {
  constructor() {} // Se não tiver dependências, o construtor pode estar vazio

  getCreateInput(pessoaData: any): PessoaCreateInput {
    // Apenas prepara os dados para CRIAÇÃO
    return {
      nome: pessoaData.nome,
      cpf: pessoaData.cpf,
      dataNascimento: pessoaData.dataNascimento
        ? new Date(pessoaData.dataNascimento)
        : null,
      rg: pessoaData.rg,
      estadoCivil: pessoaData.estadoCivil,
      // Supondo que splitCreateConnect seja usado para contatos, localizacoes, etc.
      contatos: pessoaData.contatos
        ? { create: pessoaData.contatos }
        : undefined,
      localizacoes: pessoaData.localizacoes
        ? { create: pessoaData.localizacoes }
        : undefined,
      formacoes: pessoaData.formacoes
        ? { create: pessoaData.formacoes }
        : undefined,
      // ... outras relações
    };
  }

  // Novo método para buscar pessoa por CPF
  async findByCpf(cpf: string): Promise<Pessoa | null> {
    return await prisma.pessoa.findUnique({
      where: { cpf },
    });
  }

  // Novo método para salvar (criar ou atualizar) a pessoa
  async save(pessoaData: any): Promise<Pessoa> {
    // Verifica se a pessoa já existe pelo ID, se fornecido
    if (pessoaData.id) {
      const existing = await prisma.pessoa.findUnique({
        where: { id: pessoaData.id },
      });
      if (existing) {
        // É uma atualização
        const { id, ...updateData } = pessoaData;
        return await prisma.pessoa.update({
          where: { id },
          data: {
            ...updateData,
            dataNascimento: updateData.dataNascimento
              ? new Date(updateData.dataNascimento)
              : undefined,
            contatos: updateData.contatos
              ? {
                  create: updateData.contatos.filter((c: any) => !c.id),
                  update: updateData.contatos
                    .filter((c: any) => c.id)
                    .map((c: any) => ({ where: { id: c.id }, data: c })),
                }
              : undefined,
            localizacoes: updateData.localizacoes
              ? {
                  create: updateData.localizacoes.filter((l: any) => !l.id),
                  update: updateData.localizacoes
                    .filter((l: any) => l.id)
                    .map((l: any) => ({ where: { id: l.id }, data: l })),
                }
              : undefined,
          } as any,
        });
      }
    }

    // Se não tem ID ou não encontrou, tenta buscar por CPF (para evitar duplicidade)
    const existingByCpf = await this.findByCpf(pessoaData.cpf);
    if (existingByCpf) {
      // Se a pessoa já existe pelo CPF, vamos atualizá-la
      const { id, ...updateData } = pessoaData;
      return await prisma.pessoa.update({
        where: { id: existingByCpf.id },
        data: {
          ...updateData,
          dataNascimento: updateData.dataNascimento
            ? new Date(updateData.dataNascimento)
            : undefined,
          contatos: updateData.contatos
            ? {
                create: updateData.contatos.filter((c: any) => !c.id),
                update: updateData.contatos
                  .filter((c: any) => c.id)
                  .map((c: any) => ({ where: { id: c.id }, data: c })),
              }
            : undefined,
          localizacoes: updateData.localizacoes
            ? {
                create: updateData.localizacoes.filter((l: any) => !l.id),
                update: updateData.localizacoes
                  .filter((l: any) => l.id)
                  .map((l: any) => ({ where: { id: l.id }, data: l })),
              }
            : undefined,
          // ... outras relações aninhadas para update
        } as any,
      });
    }

    // Se a pessoa não existe (nem por ID, nem por CPF), então cria
    const dataToCreate = this.getCreateInput(pessoaData);
    return await prisma.pessoa.create({
      data: dataToCreate as any,
    });
  }
}
