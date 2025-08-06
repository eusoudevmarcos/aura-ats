// src/routes/datastone.ts

import { Router } from "express";
import { DatastoneController } from "../controllers/datastone.controller";

const router = Router();

const datastoneController = new DatastoneController();

/**
 * Rota de busca no DataStone.
 * Espera parâmetros via query:
 * - query: valor a ser pesquisado (CPF, CNPJ, nome, etc.)
 * - tipo: "persons" ou "companies"
 * - uf, filial, list, isDetail (opcionais)
 */
router.get("/search", datastoneController.search);
router.get("/cache", datastoneController.listCache);

export default router;
