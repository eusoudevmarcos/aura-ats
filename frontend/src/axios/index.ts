import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEXT_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Interceptador de resposta para mostrar mensagem de sucesso ou erro (exceto para GET)
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
