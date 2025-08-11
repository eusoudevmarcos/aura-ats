import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { firestoreDB } from "../lib/firebaseAdmin";
import prisma from "../lib/prisma";

export default class UserController {
  async create(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;

      const userRecord = await getAuth().createUser({
        email,
        password,
        displayName: name,
      });
      await firestoreDB
        .collection("users")
        .doc(userRecord.uid)
        .set({ email, name, role });

      res.status(201).json({ uid: userRecord.uid });
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar usuário", details: error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const snapshot = await firestoreDB.collection("users").get();
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const doc = await firestoreDB
        .collection("users")
        .doc(req.params.id)
        .get();
      if (!doc.exists)
        return res.status(404).json({ error: "Usuário não encontrado" });

      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      await firestoreDB.collection("users").doc(req.params.id).update(req.body);
      res.json({ message: "Usuário atualizado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await getAuth().deleteUser(req.params.id);
      await firestoreDB.collection("users").doc(req.params.id).delete();
      res.json({ message: "Usuário deletado" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  }
}
