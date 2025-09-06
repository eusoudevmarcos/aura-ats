// src/routes/candidato.routes.ts
import { Router } from "express";
import { container } from "tsyringe";
import { AgendaController } from "../controllers/agenda.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const candidatoRouter = Router();
const candidatoController = container.resolve(AgendaController);

candidatoRouter.post("/", authMiddleware, (req, res) =>
  candidatoController.create(req, res)
);
candidatoRouter.put("/:id", authMiddleware, (req, res) =>
  candidatoController.update(req, res)
);

candidatoRouter.get("/", authMiddleware, (req, res) =>
  candidatoController.getAll(req, res)
);

candidatoRouter.get("/:id", authMiddleware, (req, res) =>
  candidatoController.findById(req, res)
);

export default candidatoRouter;
