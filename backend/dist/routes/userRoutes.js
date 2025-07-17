"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("firebase-admin/auth");
const admin_1 = require("../firebase/admin");
const router = express_1.default.Router();
// Criar novo usuário (apenas admin)
router.post('/', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const userRecord = await (0, auth_1.getAuth)().createUser({ email, password, displayName: name });
        await admin_1.db.collection('users').doc(userRecord.uid).set({ email, name, role });
        res.status(201).json({ uid: userRecord.uid });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário', details: error });
    }
});
// Listar todos usuários (apenas admin)
router.get('/', async (_req, res) => {
    try {
        const snapshot = await admin_1.db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});
// Obter detalhes de um usuário
router.get('/:id', async (req, res) => {
    try {
        const doc = await admin_1.db.collection('users').doc(req.params.id).get();
        if (!doc.exists)
            return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json({ id: doc.id, ...doc.data() });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});
// Atualizar role ou dados
router.put('/:id', async (req, res) => {
    try {
        await admin_1.db.collection('users').doc(req.params.id).update(req.body);
        res.json({ message: 'Usuário atualizado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});
// Deletar usuário
router.delete('/:id', async (req, res) => {
    try {
        await (0, auth_1.getAuth)().deleteUser(req.params.id);
        await admin_1.db.collection('users').doc(req.params.id).delete();
        res.json({ message: 'Usuário deletado' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});
exports.default = router;
