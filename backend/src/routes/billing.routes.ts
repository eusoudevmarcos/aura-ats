import { Router } from "express";
import { container } from "tsyringe";
import { BillingController } from "../controllers/billings.contoller";

const billingController = container.resolve(BillingController);
const router = Router();

// Cria assinatura mensal
router.post("/assinatura-mensal", (req, res) =>
  billingController.createAssinaturaMensal(req, res)
);

// Cria compra de plano por uso
router.post("/plano-por-uso", (req, res) =>
  billingController.createPlanoPorUso(req, res)
);

// Busca assinatura/plano por uso (PlanoAssinatura) por ID
router.get("/plano-assinatura/:id", (req, res) =>
  billingController.getByIdPlanoAssinatura(req, res)
);

// Lista todos os planos (com paginação opcional)
router.get("/planos", (req, res) => billingController.getAllPlanos(req, res));

// Atualiza um plano por ID
router.put("/planos/:id", (req, res) =>
  billingController.updatePlano(req, res)
);

// Deleta um plano por ID
router.delete("/planos/:id", (req, res) =>
  billingController.deletePlano(req, res)
);

export default router;
