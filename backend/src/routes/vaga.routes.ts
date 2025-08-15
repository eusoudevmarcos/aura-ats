import { Router } from "express";
import { container } from "tsyringe";
import { VagaController } from "../controllers/vaga.controller";

const router = Router();
const vagaController = container.resolve(VagaController);

router.post("/", (req, res) => vagaController.create(req, res));
router.get("/", (req, res) => vagaController.getAll(req, res));
router.get("/:id", (req, res) => vagaController.getById(req, res));
router.delete("/:id", (req, res) => vagaController.delete(req, res));

export default router;
