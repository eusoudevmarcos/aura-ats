import { Router } from "express";
import { ClienteController } from "../controllers/cliente.controller";
import { container } from "tsyringe";

const router = Router();
const controller = container.resolve(ClienteController);

router.post("/save", (req, res) => controller.save(req, res));
router.put("/save/:id", (req, res) => controller.save(req, res));
router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.findById(req, res));

export default router;
