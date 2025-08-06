import { Router } from "express";
import { ProfissionalController } from "../controllers/profissional.controller";
import { container } from "tsyringe";

const router = Router();

const profissionalController = container.resolve(ProfissionalController);

router.get("/:id", (req, res) => profissionalController.get(req, res));
router.post("/create", (req, res) => profissionalController.create(req, res));

export default router;
