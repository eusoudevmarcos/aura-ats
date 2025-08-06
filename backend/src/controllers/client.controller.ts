import { Request, Response } from "express";
import { firestoreDB } from "../lib/firebaseAdmin";
import prisma from "../lib/prisma";

export default class ClientController {
  async create(req: Request, res: Response) {
    try {
      const docRef = await firestoreDB.collection("clients").add(req.body);
      res.status(201).json({ id: docRef.id });
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar cliente" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const snapshot = await firestoreDB.collection("clients").get();
      const clients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar clientes" });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const doc = await firestoreDB
        .collection("clients")
        .doc(req.params.id)
        .get();
      if (!doc.exists)
        return res.status(404).json({ error: "Cliente não encontrado" });
      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cliente" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      await firestoreDB
        .collection("clients")
        .doc(req.params.id)
        .update(req.body);
      res.json({ message: "Cliente atualizado" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar cliente" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await firestoreDB.collection("clients").doc(req.params.id).delete();
      res.json({ message: "Cliente deletado" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar cliente" });
    }
  }

  createMedico = async (req: Request, res: Response) => {
    try {
      const {
        nome,
        cpf,
        crm,
        rqe,
        especialidades,
        hospitais,
        contatos,
        localizacao,
        formacao,
      } = req.body;

      // Arrays para armazenar conexões
      const especialidadesConnect = [];
      const hospitaisConnect = [];

      // 🔍 Especialidades
      for (const esp of especialidades || []) {
        if (esp.id) {
          // Verifica se o ID existe
          const existente = await prisma.especialidade.findUnique({
            where: { id: esp.id },
          });
          if (existente) {
            especialidadesConnect.push({ id: esp.id });
          }
        } else if (esp.nome) {
          // Verifica se já existe pelo nome
          let existente = await prisma.especialidade.findUnique({
            where: { nome: esp.nome },
          });
          if (!existente) {
            existente = await prisma.especialidade.create({
              data: { nome: esp.nome },
            });
          }
          especialidadesConnect.push({ id: existente.id });
        }
      }

      // 🔍 Hospitais
      for (const hosp of hospitais || []) {
        if (hosp.id) {
          const existente = await prisma.hospital.findUnique({
            where: { id: hosp.id },
          });
          if (existente) {
            hospitaisConnect.push({ id: hosp.id });
          }
        } else if (hosp.nome && hosp.cidade && hosp.estado) {
          // Verifica se já existe hospital com mesmo nome + cidade + estado
          let existente = await prisma.hospital.findFirst({
            where: {
              nome: hosp.nome,
              cidade: hosp.cidade,
              estado: hosp.estado,
            },
          });
          if (!existente) {
            existente = await prisma.hospital.create({ data: hosp });
          }
          hospitaisConnect.push({ id: existente.id });
        }
      }

      // 🩺 Cria o médico com as relações tratadas
      const novoMedico = await prisma.medico.create({
        data: {
          nome,
          cpf,
          crm,
          rqe,
          especialidades: {
            connect: especialidadesConnect,
          },
          hospitais: {
            connect: hospitaisConnect,
          },
          contatos: contatos ? { create: contatos } : undefined,
          localizacao: localizacao ? { create: localizacao } : undefined,
          formacao: formacao ? { create: formacao } : undefined,
        },
        include: {
          especialidades: true,
          hospitais: true,
          contatos: true,
          localizacao: true,
          formacao: true,
        },
      });

      return res.status(201).json(novoMedico);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar médico." });
    }
  };
}
