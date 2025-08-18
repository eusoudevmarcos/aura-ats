import { Router } from "express";
import { FuncionarioController } from "../controllers/funcionario.controller";
import { container } from "tsyringe";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const funcionarioController = container.resolve(FuncionarioController);

router.get("/", authMiddleware, (req, res) =>
  funcionarioController.getAll(req, res)
);
router.get("/:uid", authMiddleware, (req, res) =>
  funcionarioController.getById(req, res)
);

router.post("/create/pessoa", authMiddleware, (req, res) =>
  funcionarioController.createPessoa(req, res)
);
router.post("/create/empresa", authMiddleware, (req, res) =>
  funcionarioController.createEmpresa(req, res)
);

export default router;
