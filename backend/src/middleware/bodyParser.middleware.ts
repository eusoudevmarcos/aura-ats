import bodyParser from "body-parser";
import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

// Criar instâncias do body parser com limite de 50MB
const jsonParser = bodyParser.json({ limit: "50mb" });
const urlencodedParser = bodyParser.urlencoded({
  extended: true,
  limit: "50mb",
});

@Middleware({ type: "before", priority: 1 })
export class BodyParserMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    // Aplicar body parser baseado no content-type
    const contentType = req.headers["content-type"] || "";

    // Se já tem body parseado e não está vazio, continuar
    if (req.body && Object.keys(req.body).length > 0) {
      return next();
    }

    // Se não tem content-type mas é POST/PUT/PATCH, tentar JSON
    if (!contentType && ["POST", "PUT", "PATCH"].includes(req.method)) {
      jsonParser(req, res, next);
      return;
    }

    if (contentType.includes("application/json")) {
      jsonParser(req, res, next);
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      urlencodedParser(req, res, next);
    } else {
      // Se não tem content-type definido, tentar JSON por padrão para POST/PUT/PATCH
      if (["POST", "PUT", "PATCH"].includes(req.method)) {
        jsonParser(req, res, next);
      } else {
        next();
      }
    }
  }
}
