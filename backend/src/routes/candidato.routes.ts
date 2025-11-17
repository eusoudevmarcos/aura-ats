// src/routes/candidato.routes.ts
import { Router } from "express";
import { container } from "tsyringe";
import { CandidatoController } from "../controllers/candidato.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const candidatoRouter = Router();
const candidatoController = container.resolve(CandidatoController);

candidatoRouter.post("/", authMiddleware, (req, res) =>
  candidatoController.saveCandidato(req, res)
);
// candidatoRouter.put("/:id", authMiddleware, (req, res) =>
//   candidatoController.updateCandidato(req, res)
// );

candidatoRouter.get("/especialidades", authMiddleware, (req, res) =>
  candidatoController.getEspecialidades(req, res)
);

candidatoRouter.get("/:id", authMiddleware, (req, res) =>
  candidatoController.getCandidatoById(req, res)
);
candidatoRouter.get("/", authMiddleware, (req, res) =>
  candidatoController.getAllCandidatos(req, res)
);

candidatoRouter.delete("/", authMiddleware, (req, res) =>
  candidatoController.deleteCandidato(req, res)
);

candidatoRouter.get("/anexo/:anexoId/download", authMiddleware, (req, res) =>
  candidatoController.downloadAnexo(req, res)
);

export default candidatoRouter;
