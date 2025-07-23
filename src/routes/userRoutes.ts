// src/routes/userRoutes.ts
import express from 'express';
import { getAuth } from 'firebase-admin/auth';
import { db } from '../firebase/admin';

const router = express.Router();

// Criar novo usuário (apenas admin)
router.post('/', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const userRecord = await getAuth().createUser({ email, password, displayName: name });
    console.log(userRecord.uid)
    const user = await db.collection('users').doc(userRecord.uid).set({ email, name, role });
    console.log(user)
    res.status(201).json({ uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário', details: error });
  }
});

// Listar todos usuários (apenas admin)
router.get('/', async (_req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Obter detalhes de um usuário
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Atualizar role ou dados
router.put('/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).update(req.body);
    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
  try {
    await getAuth().deleteUser(req.params.id);
    await db.collection('users').doc(req.params.id).delete();
    res.json({ message: 'Usuário deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

export default router;