import { Router } from "express";
import { FuncionarioController } from "../controllers/funcionario.controller";
import { container } from "tsyringe";

const router = Router();

const funcionarioController = container.resolve(FuncionarioController);

router.post("/create/pessoa", (req, res) =>
  funcionarioController.createPessoa(req, res)
);
router.post("/create/empresa", (req, res) =>
  funcionarioController.createEmpresa(req, res)
);

export default router;
