import axios from "axios";
const api = axios.create({
  // Este baseURL deve ser o do seu Next.js (ex: http://localhost:3000 ou https://aura-ats-frontend.vercel.app)
  baseURL: process.env.NEXT_PUBLIC_NEXT_URL || "http://localhost:3001",
  withCredentials: true, // Essencial para que o navegador envie cookies para o próprio Next.js
});

export default api;
