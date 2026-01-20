import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import "reflect-metadata";
import {
  createExpressServer,
  useContainer as rcUseContainer,
} from "routing-controllers";

dotenv.config();

// Importar todas as controllers
import { AgendaController } from "./controllers/agenda.controller";
import AuthenticationController from "./controllers/authentication.controller";
import { BillingController } from "./controllers/billings.contoller";
import { CandidatoController } from "./controllers/candidato.controller";
import { ClienteController } from "./controllers/cliente.controller";
import { DatastoneController } from "./controllers/datastone.controller";
import { EmailController } from "./controllers/email.controller";
import { EspecialidadeController } from "./controllers/especilidade.controller";
import { FuncionarioController } from "./controllers/funcionario.controller";
import { KanbanController } from "./controllers/kanban.controller";
import { SessaoController } from "./controllers/sessao.controller";
import { TarefaController } from "./controllers/tarefa.controller";
import { TriagemController } from "./controllers/triagem.controller";
import UserController from "./controllers/user.controller";
import { VagaController } from "./controllers/vaga.controller";

// Importar container adapter e error handler
import { container } from "./lib/container";
import { BodyParserMiddleware } from "./middleware/bodyParser.middleware";
import { ErrorHandler } from "./middleware/errorHandler";

// Make routing-controllers use typedi as its IoC container (remove "container:" from createExpressServer below)
rcUseContainer(container);

const PORT = process.env.PORT || 3001;

const allowedOrigins: string[] = [
  "http://localhost:3000", // frontend local
  "https://takeitapi-1.onrender.com", // produção
  "https://aura-ats-frontend.vercel.app", // produção
  "https://www.aurareslabs.com", // produção vercel
  "https://aura-ats-frontend.onrender.com/", // produção render
];

async function startServer() {
  // Criar servidor Express usando routing-controllers
  const app = createExpressServer({
    routePrefix: "/api",
    controllers: [
      AuthenticationController,
      UserController,
      CandidatoController,
      DatastoneController,
      FuncionarioController,
      ClienteController,
      VagaController,
      AgendaController,
      TriagemController,
      BillingController,
      TarefaController,
      SessaoController,
      EmailController,
      EspecialidadeController,
      KanbanController,
    ],
    middlewares: [BodyParserMiddleware, ErrorHandler],
    defaultErrorHandler: false,
    cors: {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => {
        // Permitir requests sem origin (como do Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    },
    defaults: {
      paramOptions: {
        required: false, // Tornar parâmetros opcionais por padrão
      },
    },
    validation: {
      whitelist: true,
      forbidNonWhitelisted: false,
      skipMissingProperties: true,
    },
  });

  // Middleware de logging em desenvolvimento
  if (process.env.NODE_ENV === "development") {
    app.use((req: Request, res: Response, next: NextFunction) => {
      const { method, url, headers, body, query, params } = req;
      const timestamp = new Date().toISOString();

      // Códigos de escape ANSI para cores
      const reset = "\x1b[0m";
      const green = "\x1b[32m";
      const cyan = "\x1b[36m";
      const red = "\x1b[31m";

      console.log(`\n\n\[${timestamp}\] Request:`);
      console.log(`${green}${method}${reset} - ${cyan}${url}${reset}`);

      if (headers.authorization || headers.cookie) {
        console.log(`${red}${headers.authorization || headers.cookie}${reset}`);
      }

      if (query && Object.keys(query).length > 0) {
        console.log(`  Query: ${cyan}${JSON.stringify(query)}`);
      }
      if (body && Object.keys(body).length > 0) {
        console.log(`  Body: ${cyan}${JSON.stringify(body)}`);
      }
      if (params && Object.keys(params).length > 0) {
        console.log(`  Params: ${cyan}${JSON.stringify(params)}`);
      }
      console.log(
        "-----------------------------------------------------------"
      );
      next();
    });
  }

  // Rota de ping
  app.get("/api/ping", (req: Request, res: Response) =>
    res.status(200).send("ok")
  );

  // Servir arquivos estáticos
  const publicPath = path.resolve(__dirname, "public");
  app.use("/files", express.static(path.join(publicPath, "files")));

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
