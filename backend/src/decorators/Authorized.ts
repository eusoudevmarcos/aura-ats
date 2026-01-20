import { UseBefore } from "routing-controllers";
import { AuthMiddleware } from "../middleware/authMiddleware";

/**
 * Decorator para proteger rotas com autenticação
 * Equivalente a @UseBefore(AuthMiddleware)
 */
export function Authorized() {
  return UseBefore(AuthMiddleware);
}
