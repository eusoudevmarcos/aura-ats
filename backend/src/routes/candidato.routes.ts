// src/routes/candidato.routes.ts
import { Router } from "express";
import { CandidatoController } from "../controllers/candidato.controller";
import { container } from "tsyringe";

const candidatoRouter = Router();
const candidatoController = container.resolve(CandidatoController);

candidatoRouter.post("/", (req, res) =>
  candidatoController.createCandidato(req, res)
);
candidatoRouter.put("/:id", (req, res) =>
  candidatoController.updateCandidato(req, res)
);
candidatoRouter.get("/:id", (req, res) =>
  candidatoController.getCandidatoById(req, res)
);
candidatoRouter.get("/", (req, res) =>
  candidatoController.getAllCandidatos(req, res)
);
candidatoRouter.delete("/:id", (req, res) =>
  candidatoController.deleteCandidato(req, res)
);

export default candidatoRouter;
