import { Router } from "express";
import { container } from "tsyringe";
import { EmailController } from "../controllers/email.controller";

const emailRouter = Router();
const controller = container.resolve(EmailController);

emailRouter.get("/verify", (req, res) => controller.verify(req, res));

export default emailRouter;
