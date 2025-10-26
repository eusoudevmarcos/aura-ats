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
router.get("/", (req, res) => billingController.getAllPlanos(req, res));

// Atualiza um plano por ID
router.put("/planos/:id", (req, res) =>
  billingController.updatePlano(req, res)
);

// Deleta um plano por ID
router.delete("/planos/:id", (req, res) =>
  billingController.deletePlano(req, res)
);

// Debita um uso do plano do cliente logado
router.post("/debitar-uso", (req, res) =>
  billingController.debitarUsoCliente(req, res)
);

// Busca planos do cliente logado
router.get("/planos-usuario", (req, res) =>
  billingController.getPlanosUsuario(req, res)
);

export default router;
