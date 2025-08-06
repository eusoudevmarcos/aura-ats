// src/routes/clientRoutes.ts
import express from "express";
import ClientController from "../controllers/client.controller";

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

router.post("/medico/create", clientController.createMedico);

export default router;
