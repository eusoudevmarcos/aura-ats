// src/routes/datastone.ts

import { Router } from "express";
import { DatastoneController } from "../controllers/datastone.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const datastoneController = new DatastoneController();

router.get("/search", authMiddleware, (req: any, res) =>
  datastoneController.search(req, res)
);
router.get("/cache", authMiddleware, datastoneController.listCache);

export default router;
