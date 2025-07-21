import { Request, Response } from 'express';
import * as datastoneService from '../services/datastoneService';

// Tipagem para a query da requisição de busca
interface SearchRequestQuery {
    query: string;
    type: 'pf' | 'pj';
    uf?: string;
}

export const search = async (req: Request<{}, {}, {}, SearchRequestQuery>, res: Response): Promise<void> => {
    try {
        const { query, type, uf } = req.query;

        if (!query || !type) {
            res.status(400).json({ message: 'Os parâmetros "query" e "type" são obrigatórios.' });
            return;
        }

        const results = await datastoneService.searchEntity({ query, type, uf });
        res.status(200).json(results);
    } catch (error) {
        console.error('Erro no controlador de busca:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};


export const getDetails = async (req: Request<{ document: string }, {}, {}, { type: 'pf' | 'pj' }>, res: Response): Promise<void> => {
    try {
        const { document } = req.params;
        const { type } = req.query;

        if (!document || !type) {
            res.status(400).json({ message: 'O documento na URL e o "type" na query string são obrigatórios.' });
            return;
        }

        const details = await datastoneService.getEntityDetails(document, type);

        if (!details) {
            res.status(404).json({ message: 'Documento não encontrado ou erro na fonte de dados.' });
            return;
        }

        res.status(200).json(details);
    } catch (error) {
        console.error('Erro no controlador de detalhes:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};