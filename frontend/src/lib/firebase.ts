import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, child, set } from "firebase/database";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoW3k9bK8d8fDKjy48qNn03BpdOXIBPa0",
  authDomain: "auradb-a857f.firebaseapp.com",
  projectId: "auradb-a857f",
  storageBucket: "auradb-a857f.firebasestorage.app",
  messagingSenderId: "812771286978",
  appId: "1:812771286978:web:f037b4a9540715db8ec05b",
  measurementId: "G-TSKND0VTYK",
};

// Inicializa a instância
const app = initializeApp(firebaseConfig);

// Instâncias dos serviços
const firestore = getFirestore(app);
const database = getDatabase(app);
const auth = getAuth(app);

export {
  app,
  firestore,
  database,
  auth,
  ref,
  get,
  child,
  set,
  doc,
  setDoc,
  getDoc,
};
