import { Router } from "express";
import { container } from "tsyringe";
import { EspecialidadeController } from "../controllers/especilidade.controller";

const especialidadeRouter = Router();
const controller = container.resolve(EspecialidadeController);

especialidadeRouter.get("/", (req, res) =>
  controller.listarEspecialidades(req, res)
);
especialidadeRouter.get("/:id", (req, res) =>
  controller.buscarEspecialidadePorId(req, res)
);
especialidadeRouter.post("/", (req, res) =>
  controller.criarEspecialidade(req, res)
);
especialidadeRouter.put("/:id", (req, res) =>
  controller.atualizarEspecialidade(req, res)
);
especialidadeRouter.delete("/:id", (req, res) =>
  controller.removerEspecialidade(req, res)
);

export default especialidadeRouter;
