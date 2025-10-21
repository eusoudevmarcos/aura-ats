import express from "express";
import { container } from "tsyringe";
import { TarefaController } from "../controllers/tarefa.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

const tarefaController = container.resolve(TarefaController);

// Salvar tarefa (criar ou atualizar)
router.post("/", authMiddleware, tarefaController.save.bind(tarefaController));

// Buscar todas as tarefas do usuário logado
router.get(
  "/",
  authMiddleware,
  tarefaController.getAllByUsuario.bind(tarefaController)
);

// Buscar tarefa por ID
router.get(
  "/:id",
  authMiddleware,
  tarefaController.getById.bind(tarefaController)
);

// Deletar tarefa
router.delete(
  "/",
  authMiddleware,
  tarefaController.delete.bind(tarefaController)
);

// Atualizar ordem das tarefas
router.put(
  "/order",
  authMiddleware,
  tarefaController.updateOrder.bind(tarefaController)
);

export default router;
