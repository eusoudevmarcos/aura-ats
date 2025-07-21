import 'dotenv/config'; // Carrega as variáveis de ambiente no início
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import entityRoutes from './routes/entityRoutes';

const app: Express = express();
const PORT: number = parseInt(process.env.API_PORT || '3001', 10);

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('TakeItAPI (TypeScript) está no ar!');
});

// Rotas da API
app.use('/api/entity', entityRoutes);


app.listen(PORT, () => {
    console.log(`🚀 Servidor TakeItAPI (TS) rodando na porta ${PORT}`);
});