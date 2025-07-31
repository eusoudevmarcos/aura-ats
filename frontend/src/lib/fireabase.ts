import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCoW3k9bK8d8fDKjy48qNn03BpdOXIBPa0",
  authDomain: "auradb-a857f.firebaseapp.com",
  projectId: "auradb-a857f",
  storageBucket: "auradb-a857f.firebasestorage.app",
  messagingSenderId: "812771286978",
  appId: "1:812771286978:web:f037b4a9540715db8ec05b",
  measurementId: "G-TSKND0VTYK",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase(app);

export { db, ref, get, child };
