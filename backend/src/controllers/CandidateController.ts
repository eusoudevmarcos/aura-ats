import { Request, Response } from "express";
import { firestoreDB } from "../lib/firebaseAdmin";

export default class CandidateController {
  async create(req: Request, res: Response) {
    try {
      const docRef = await firestoreDB.collection("candidates").add(req.body);
      res.status(201).json({ id: docRef.id });
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar candidato" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const snapshot = await firestoreDB.collection("candidates").get();
      const candidates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar candidatos" });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const doc = await firestoreDB
        .collection("candidates")
        .doc(req.params.id)
        .get();
      if (!doc.exists)
        return res.status(404).json({ error: "Candidato não encontrado" });
      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar candidato" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      await firestoreDB
        .collection("candidates")
        .doc(req.params.id)
        .update(req.body);
      res.json({ message: "Candidato atualizado" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar candidato" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await firestoreDB.collection("candidates").doc(req.params.id).delete();
      res.json({ message: "Candidato deletado" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar candidato" });
    }
  }
}
