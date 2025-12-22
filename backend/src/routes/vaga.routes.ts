import { Router } from "express";
import { container } from "tsyringe";
import { VagaController } from "../controllers/vaga.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const vagaController = container.resolve(VagaController);

router.get("/:id/historico", authMiddleware, (req, res) =>
  vagaController.getHistoricoByVagaId(req, res)
);
router.get("/:id", (req, res) => vagaController.getById(req, res));
router.get("/cliente/:clienteId", authMiddleware, (req, res) =>
  vagaController.getAllByClienteId(req, res)
);
router.get("/candidato/:candidatoId", authMiddleware, (req, res) =>
  vagaController.getAllByCandidatoId(req, res)
);
router.get("/", authMiddleware, (req, res) => vagaController.getAll(req, res));
router.post("/", authMiddleware, (req, res) => vagaController.save(req, res));
router.post("/vincular-candidatos/:id", authMiddleware, (req, res) =>
  vagaController.vincularCandidato(req, res)
);

router.patch("/status", authMiddleware, (req, res) =>
  vagaController.updateStatus(req, res)
);

router.delete("/:id", authMiddleware, (req, res) =>
  vagaController.delete(req, res)
);

export default router;
