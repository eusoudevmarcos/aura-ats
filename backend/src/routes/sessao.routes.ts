import express from "express";
import { container } from "tsyringe";
import { SessaoController } from "../controllers/sessao.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

const sessaoController = container.resolve(SessaoController);

// Buscar sessão atual
router.get(
  "/current",
  authMiddleware,
  sessaoController.getCurrentSession.bind(sessaoController)
);

// Buscar ID do usuário da sessão atual
router.get(
  "/user-id",
  authMiddleware,
  sessaoController.getUserId.bind(sessaoController)
);

// Validar sessão
router.get(
  "/validate",
  authMiddleware,
  sessaoController.validateSession.bind(sessaoController)
);

// Deletar sessão atual
router.delete(
  "/",
  authMiddleware,
  sessaoController.deleteSession.bind(sessaoController)
);

// Deletar todas as sessões de um usuário
router.delete(
  "/user/:userId",
  authMiddleware,
  sessaoController.deleteAllUserSessions.bind(sessaoController)
);

// Limpar sessões expiradas
router.delete(
  "/cleanup",
  authMiddleware,
  sessaoController.cleanupExpiredSessions.bind(sessaoController)
);

export default router;
