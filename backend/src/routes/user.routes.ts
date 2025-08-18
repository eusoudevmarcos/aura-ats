import express from "express";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

const userController = new UserController();

router.post("/", authMiddleware, userController.create);

router.get("/", authMiddleware, userController.getAll);

router.get("/:id", authMiddleware, userController.getOne);

router.put("/:id", authMiddleware, userController.update);

router.delete("/:id", authMiddleware, userController.delete);

export default router;
