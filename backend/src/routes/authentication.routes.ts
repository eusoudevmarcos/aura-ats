import express from "express";
import AuthenticationController from "../controllers/authentication.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
const authenticationController = new AuthenticationController();

router.post("/login", authenticationController.logIn);

router.post("/logout", authMiddleware, authenticationController.logOut);

router.post("/register", authenticationController.register);

export default router;
