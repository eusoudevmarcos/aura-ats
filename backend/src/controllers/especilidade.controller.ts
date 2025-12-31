import { Request, Response } from "express";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";

@injectable()
export class EspecialidadeController {
  /**
   * Listar todas as especialidades
   */
  async listarEspecialidades(req: Request, res: Response) {
    try {
      const especialidades = await prisma.especialidade.findMany();
      return res.status(200).json(especialidades);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar especialidades." });
    }
  }

  /**
   * Buscar uma especialidade por ID
   */
  async buscarEspecialidadePorId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const especialidade = await prisma.especialidade.findUnique({
        where: { id: Number(id) },
      });
      if (!especialidade) {
        return res.status(404).json({ error: "Especialidade não encontrada." });
      }
      return res.status(200).json(especialidade);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar especialidade." });
    }
  }

  /**
   * Criar uma nova especialidade
   */
  async criarEspecialidade(req: Request, res: Response) {
    const { nome, sigla } = req.body;
    try {
      const novaEspecialidade = await prisma.especialidade.create({
        data: { nome, sigla },
      });
      return res.status(201).json(novaEspecialidade);
    } catch (error: any) {
      return res
        .status(400)
        .json({ error: error.message || "Erro ao criar especialidade." });
    }
  }

  /**
   * Atualizar uma especialidade existente
   */
  async atualizarEspecialidade(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, sigla } = req.body;
    try {
      const especialidadeAtualizada = await prisma.especialidade.update({
        where: { id: Number(id) },
        data: { nome, sigla },
      });
      return res.status(200).json(especialidadeAtualizada);
    } catch (error: any) {
      return res
        .status(400)
        .json({ error: error.message || "Erro ao atualizar especialidade." });
    }
  }

  /**
   * Remover uma especialidade
   */
  async removerEspecialidade(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.especialidade.delete({ where: { id: Number(id) } });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar especialidade." });
    }
  }
}

export const listarEspecialidades = (req: Request, res: Response) =>
  new EspecialidadeController().listarEspecialidades(req, res);
export const buscarEspecialidadePorId = (req: Request, res: Response) =>
  new EspecialidadeController().buscarEspecialidadePorId(req, res);
export const criarEspecialidade = (req: Request, res: Response) =>
  new EspecialidadeController().criarEspecialidade(req, res);
export const atualizarEspecialidade = (req: Request, res: Response) =>
  new EspecialidadeController().atualizarEspecialidade(req, res);
export const removerEspecialidade = (req: Request, res: Response) =>
  new EspecialidadeController().removerEspecialidade(req, res);
