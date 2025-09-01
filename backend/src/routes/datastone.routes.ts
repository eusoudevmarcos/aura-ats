// src/routes/datastone.ts

import { Router } from "express";
import { DatastoneController } from "../controllers/datastone.controller";

const router = Router();

const datastoneController = new DatastoneController();

router.get("/search", (req: any, res) => datastoneController.search(req, res));
router.get("/cache", datastoneController.listCache);

export default router;
