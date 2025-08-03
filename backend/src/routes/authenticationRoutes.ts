// src/routes/candidateRoutes.ts
import express from "express";
import AuthenticationController from "../controllers/AuthenticationController";

const router = express.Router();

const authenticationController = new AuthenticationController();

// Logar
router.post("/login", authenticationController.logIn);
router.post("/logout", authenticationController.logOut);

export default router;
