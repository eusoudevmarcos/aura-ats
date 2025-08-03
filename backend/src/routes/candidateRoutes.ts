// src/routes/candidateRoutes.ts
import express from "express";
import CandidateController from "../controllers/CandidateController";

const router = express.Router();

const candidateController = new CandidateController();

// Criar candidato
router.post("/", candidateController.create);

// Listar candidatos
router.get("/", candidateController.getAll);

// Obter detalhes
router.get("/:id", candidateController.getOne);

// Atualizar
router.put("/:id", candidateController.update);

// Deletar
router.delete("/:id", candidateController.delete);

export default router;
