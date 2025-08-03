// src/routes/userRoutes.ts
import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();

const userController = new UserController();

router.post("/", userController.create);

router.get("/", userController.getAll);

router.get("/:id", userController.getOne);

router.put("/:id", userController.update);

router.delete("/:id", userController.delete);

export default router;
