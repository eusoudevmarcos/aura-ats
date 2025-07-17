"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/candidateRoutes.ts
const express_1 = __importDefault(require("express"));
const admin_1 = require("../firebase/admin");
const router = express_1.default.Router();
// Criar candidato
router.post('/', async (req, res) => {
    try {
        const docRef = await admin_1.db.collection('candidates').add(req.body);
        res.status(201).json({ id: docRef.id });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar candidato' });
    }
});
// Listar candidatos
router.get('/', async (_req, res) => {
    try {
        const snapshot = await admin_1.db.collection('candidates').get();
        const candidates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(candidates);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar candidatos' });
    }
});
// Obter detalhes
router.get('/:id', async (req, res) => {
    try {
        const doc = await admin_1.db.collection('candidates').doc(req.params.id).get();
        if (!doc.exists)
            return res.status(404).json({ error: 'Candidato não encontrado' });
        res.json({ id: doc.id, ...doc.data() });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar candidato' });
    }
});
// Atualizar
router.put('/:id', async (req, res) => {
    try {
        await admin_1.db.collection('candidates').doc(req.params.id).update(req.body);
        res.json({ message: 'Candidato atualizado' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar candidato' });
    }
});
// Deletar
router.delete('/:id', async (req, res) => {
    try {
        await admin_1.db.collection('candidates').doc(req.params.id).delete();
        res.json({ message: 'Candidato deletado' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar candidato' });
    }
});
exports.default = router;
