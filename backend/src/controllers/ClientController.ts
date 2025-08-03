import { Request, Response } from "express";
import { firestoreDB } from "../lib/firebaseAdmin";

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
}
