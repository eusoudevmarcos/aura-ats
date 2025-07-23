import { getAuth } from 'firebase-admin/auth';
import { db } from '../../firebase/admin';

async function createAdmin() {
  const email = 'admin@admin.com';
  const password = 'admin';
  const name = 'Administrador';
  const role = 'admin';

  const userRecord = await getAuth().createUser({ email, password, displayName: name });
  await db.collection('users').doc(userRecord.uid).set({ email, name, role });
  console.log('Usuário admin criado:', userRecord.uid);
}

createAdmin().catch(console.error);