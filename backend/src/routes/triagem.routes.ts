import { Router } from "express";
import { container } from "tsyringe";
import { TriagemController } from "../controllers/triagem.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const triagemController = container.resolve(TriagemController);

router.get("/", authMiddleware, (req, res) =>
  triagemController.getAll(req, res)
);

router.get("/pendentes", authMiddleware, (req, res) =>
  triagemController.getAllPendentes(req, res)
);

router.get("/:id", authMiddleware, (req, res) =>
  triagemController.findById(req, res)
);

router.post("/save", authMiddleware, (req, res) =>
  triagemController.save(req, res)
);

export default router;
