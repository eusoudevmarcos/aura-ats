import { Router } from 'express';
import { db } from '../firebase/admin';
import { Schedule } from '../models/Schedule';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { professionalId, interviewId, clientId, jobId, date, status } = req.body;

    const schedule: Schedule = {
      professionalId,
      interviewId,
      clientId,
      jobId,
      date: new Date(date),
      status: status || 'pendente',
    };

    const docRef = await db.collection('schedules').add(schedule);
    res.status(201).json({ id: docRef.id, ...schedule });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar agenda.' });
  }
});

export default router;