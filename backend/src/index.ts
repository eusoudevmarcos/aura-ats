import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";

dotenv.config();

import agendaRoute from "./routes/agenda.routes";
import authenticationRoutes from "./routes/authentication.routes";
import billingRoutes from "./routes/billing.routes";
import candidatoRoutes from "./routes/candidato.routes";
import clienteRoutes from "./routes/cliente.routes";
import datastoneRoutes from "./routes/datastone.routes";
import emailRoutes from "./routes/email.routes";
import funcionarioRoutes from "./routes/funcionario.routes";
import sessaoRoutes from "./routes/sessao.routes";
import tarefaRoutes from "./routes/tarefa.routes";
import triagemRoutes from "./routes/triagem.routes";
import userRoutes from "./routes/user.routes";
import vagaRoutes from "./routes/vaga.routes";

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
  "http://localhost:3000", // frontend local
  "https://takeitapi-1.onrender.com", // produção
  "https://aura-ats-frontend.vercel.app", // produção
  "https://www.aurareslabs.com", // produção
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sem origin (como do Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    // console.clear();
    const { method, url, headers, body, query } = req;
    const timestamp = new Date().toISOString();

    // Códigos de escape ANSI para cores
    const reset = "\x1b[0m";
    const green = "\x1b[32m";
    const cyan = "\x1b[36m";
    const red = "\x1b[31m";

    console.log(`\[${timestamp}\] Request:`);
    console.log(`${green}${method}${reset} - ${cyan}${url}${reset}`);

    if (headers.authorization || headers.cookie) {
      console.log(`${red}${headers.authorization || headers.cookie}${reset}`);
    }

    console.log(`- Query Params: ${JSON.stringify(query)}`);
    if (Object.keys(body).length > 0) {
      console.log(`  Body: ${JSON.stringify(body)}`);
    }
    console.log("-----------------------------------------------------------");
    next(); // Continua para a próxima middleware ou rota
  });
}

app.get("/api/ping", (req, res) => res.status(200).send("ok"));

app.use("/api/auth", authenticationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/candidates", candidatoRoutes);
app.use("/api/take-it", datastoneRoutes);
app.use("/api/funcionario", funcionarioRoutes);
app.use("/api/cliente", clienteRoutes);
app.use("/api/candidato", candidatoRoutes);
app.use("/api/vaga", vagaRoutes);
app.use("/api/agenda", agendaRoute);
app.use("/api/triagem", triagemRoutes);
app.use("/api/planos", billingRoutes);
app.use("/api/tarefa", tarefaRoutes);
app.use("/api/sessao", sessaoRoutes);
app.use("/api/email", emailRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
