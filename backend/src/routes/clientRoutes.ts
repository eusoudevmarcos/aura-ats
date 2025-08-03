// src/routes/clientRoutes.ts
import express from "express";
import { firestoreDB } from "../lib/firebaseAdmin";
import ClientController from "../controllers/ClientController";

const router = express.Router();

const clientController = new ClientController();

// Criar novo cliente
router.post("/", clientController.create);

// Listar clientes
router.get("/", clientController.getAll);

// Obter detalhes
router.get("/:id", clientController.getOne);

// Atualizar
router.put("/:id", clientController.update);

// Deletar
router.delete("/:id", clientController.delete);

export default router;
