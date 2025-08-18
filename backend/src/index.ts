import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

import authenticationRoutes from "./routes/authentication.routes";
import userRoutes from "./routes/user.routes";
import candidatoRoutes from "./routes/candidato.routes";
import datastoneRoutes from "./routes/datastone.routes";
import funcionarioRoutes from "./routes/funcionario.routes";
// import vagaRoutes from "./routes/vaga.routes";
import clienteRoutes from "./routes/cliente.routes";

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
  "http://localhost:3000", // frontend local
  "https://takeitapi-1.onrender.com", // produção
  "https://aura-ats-frontend.vercel.app", // produção
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

app.use("/api/auth", authenticationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/candidates", candidatoRoutes);
app.use("/api/take-it", datastoneRoutes);
app.use("/api/funcionario", funcionarioRoutes);
app.use("/api/cliente", clienteRoutes);
app.use("/api/candidato", candidatoRoutes);
// app.use("/api/vaga", vagaRoutes);
1;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
