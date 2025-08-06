import express from "express";
import UserController from "../controllers/user.controller";

const router = express.Router();

const userController = new UserController();

router.post("/", userController.create);

router.get("/", userController.getAll);

router.get("/:id", userController.getOne);

router.put("/:id", userController.update);

router.delete("/:id", userController.delete);

export default router;
