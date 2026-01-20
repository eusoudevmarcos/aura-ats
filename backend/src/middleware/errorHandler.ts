import { Request, Response } from "express";
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from "routing-controllers";

@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    error: any,
    req: Request,
    res: Response,
    next: (err?: any) => any
  ): void {
    console.log("Error:", error);

    const status = error.httpCode || error.status || 500;
    const message = error.message || "Erro interno do servidor";

    res.status(status).json({
      message,
      error,
    });
  }
}
