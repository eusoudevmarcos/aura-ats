// src/repository/pessoa.repository.ts
import { Pessoa, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { PessoaCreateInput } from "../types/prisma.types";

@injectable()
export class PessoaRepository {
  getCreateInput(pessoaData: any): PessoaCreateInput {
    return {
      nome: pessoaData.nome,
      cpf: pessoaData.cpf,
      dataNascimento: pessoaData.dataNascimento
        ? new Date(pessoaData.dataNascimento)
        : null,
      rg: pessoaData.rg,
      estadoCivil: pessoaData.estadoCivil,
      contatos: pessoaData.contatos
        ? { create: pessoaData.contatos }
        : undefined,
      localizacoes: pessoaData.localizacoes
        ? { create: pessoaData.localizacoes }
        : undefined,
      formacoes: pessoaData.formacoes
        ? { create: pessoaData.formacoes }
        : undefined,
    };
  }

  async findByCpf(cpf: string): Promise<Pessoa | null> {
    return await prisma.pessoa.findUnique({
      where: { cpf },
    });
  }

  async findByIdWithTransaction(
    id: string,
    tx: Omit<
      PrismaClient,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ): Promise<Pessoa | null> {
    return await tx.pessoa.findUnique({
      where: { id },
      include: {
        contatos: true,
        localizacoes: true,
        usuarioSistema: true,
        socios: true,
        candidato: true,
      },
    });
  }

  async findByCpfWithTransaction(
    cpf: string,
    tx: Omit<
      PrismaClient,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ): Promise<Pessoa | null> {
    return await tx.pessoa.findUnique({
      where: { cpf },
      include: {
        contatos: true,
        localizacoes: true,
        usuarioSistema: true,
        socios: true,
        candidato: true,
      },
    });
  }

  async findById(id: string): Promise<Pessoa | null> {
    return this.findByIdWithTransaction(id, prisma);
  }

  async saveWithTransaction(
    pessoaData: any,
    tx: Omit<
      PrismaClient,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ): Promise<Pessoa> {
    if (pessoaData.id) {
      const existing = await tx.pessoa.findUnique({
        where: { id: pessoaData.id },
      });
      if (existing) {
        const { id, ...updateData } = pessoaData;
        return await tx.pessoa.update({
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

    const existingByCpf = await this.findByCpf(pessoaData.cpf);
    if (existingByCpf) {
      const { id, ...updateData } = pessoaData;
      return await tx.pessoa.update({
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
        } as any,
      });
    }

    const dataToCreate = this.getCreateInput(pessoaData);
    return await tx.pessoa.create({
      data: dataToCreate as any,
    });
  }
}
