// src/routes/candidateRoutes.ts
import express from "express";
import AuthenticationController from "../controllers/authentication.controller";

const router = express.Router();

const authenticationController = new AuthenticationController();

// Logar
router.post("/login", authenticationController.logIn);
router.post("/logout", authenticationController.logOut);
router.post("/register", authenticationController.register);

export default router;
