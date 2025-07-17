import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const serviceAccount = require(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS!));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };