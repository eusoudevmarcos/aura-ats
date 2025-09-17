import axios from 'axios';

// Função utilitária para exibir o componente de notificação flutuante
function showFloatingNotification(message: string, type: 'success' | 'error') {
  // Remove notificações antigas, se houver
  const old = document.getElementById('floating-notification');
  if (old) old.remove();

  const div = document.createElement('div');
  div.id = 'floating-notification';
  div.innerText = message;
  div.style.position = 'fixed';
  div.style.top = '20px';
  div.style.left = '50%';
  div.style.transform = 'translateX(-50%)';
  div.style.zIndex = '9999';
  div.style.padding = '12px 32px';
  div.style.borderRadius = '8px';
  div.style.fontWeight = 'bold';
  div.style.fontSize = '16px';
  div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  div.style.background = type === 'success' ? '#22c55e' : '#ef4444';
  div.style.color = '#fff';
  div.style.opacity = '0.95';
  div.style.transition = 'opacity 0.3s';

  document.body.appendChild(div);

  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => div.remove(), 300);
  }, 3000);
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEXT_URL || 'http://localhost:3001',
  withCredentials: true,
});

// Interceptador de resposta para mostrar mensagem de sucesso ou erro
api.interceptors.response.use(
  response => {
    if (typeof window !== 'undefined') {
      showFloatingNotification('Requisição realizada com sucesso!', 'success');
    }
    return response;
  },
  error => {
    if (typeof window !== 'undefined') {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao realizar requisição!';
      showFloatingNotification(msg, 'error');
    }
    return Promise.reject(error);
  }
);

export default api;
