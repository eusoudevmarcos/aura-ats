import { Router } from "express";
import { container } from "tsyringe";
import { ClienteController } from "../controllers/cliente.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const controller = container.resolve(ClienteController);

router.post("/save", authMiddleware, (req, res) => controller.save(req, res));

router.put("/save/:id", authMiddleware, (req, res) =>
  controller.save(req, res)
);

router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));

router.get("/kanban", authMiddleware, (req, res) =>
  controller.getAllKanban(req, res)
);

router.get("/:id", authMiddleware, (req, res) => controller.findById(req, res));

router.patch("/status", authMiddleware, (req, res) =>
  controller.updateStatus(req, res)
);

router.delete("/", authMiddleware, (req, res) => controller.delete(req, res));

export default router;
