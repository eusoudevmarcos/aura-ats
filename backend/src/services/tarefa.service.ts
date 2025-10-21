import { Tarefa } from "@prisma/client";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";

export type TarefaInput = {
  id?: number;
  idUsuarioSistema: string;
  descricao: string;
  concluida?: boolean;
  orderBy?: number;
};

@injectable()
export class TarefaService {
  constructor() {}

  async save(data: TarefaInput): Promise<Tarefa> {
    if (!data.id) {
      // Criar nova tarefa
      return await prisma.tarefa.create({
        data: {
          idUsuarioSistema: data.idUsuarioSistema,
          descricao: data.descricao,
          concluida: data.concluida || false,
          orderBy: data.orderBy || 0,
        },
      });
    } else {
      // Atualizar tarefa existente
      return await prisma.tarefa.update({
        where: { id: data.id },
        data: {
          descricao: data.descricao,
          concluida: data.concluida,
          orderBy: data.orderBy,
        },
      });
    }
  }

  async getAllByUsuario(idUsuarioSistema: string): Promise<Tarefa[]> {
    return await prisma.tarefa.findMany({
      where: { idUsuarioSistema },
      orderBy: [{ orderBy: "asc" }, { createdAt: "desc" }],
    });
  }

  async getById(id: number): Promise<Tarefa | null> {
    return await prisma.tarefa.findUnique({
      where: { id },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.tarefa.delete({
      where: { id },
    });
  }

  async updateOrder(tarefas: { id: number; orderBy: number }[]): Promise<void> {
    await prisma.$transaction(
      tarefas.map((tarefa) =>
        prisma.tarefa.update({
          where: { id: tarefa.id },
          data: { orderBy: tarefa.orderBy },
        })
      )
    );
  }
}
