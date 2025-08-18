import { Router } from "express";
import { ClienteController } from "../controllers/cliente.controller";
import { container } from "tsyringe";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const controller = container.resolve(ClienteController);

router.post("/save", authMiddleware, (req, res) => controller.save(req, res));
router.put("/save/:id", authMiddleware, (req, res) =>
  controller.save(req, res)
);
router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.get("/:id", authMiddleware, (req, res) => controller.findById(req, res));

export default router;
