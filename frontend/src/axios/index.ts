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

// Interceptador de resposta para mostrar mensagem de sucesso ou erro (exceto para GET)
api.interceptors.response.use(
  response => {
    if (
      typeof window !== 'undefined' &&
      response?.config?.method?.toUpperCase() !== 'GET'
    ) {
      let mensagem = 'Requisição realizada com sucesso!';
      const metodo = response?.config?.method?.toUpperCase();
      if (metodo === 'POST') {
        mensagem = 'Cadastro realizado com sucesso!';
      } else if (metodo === 'PUT') {
        mensagem = 'Edição realizada com sucesso!';
      } else if (metodo === 'DELETE') {
        mensagem = 'Remoção realizada com sucesso!';
      }
      showFloatingNotification(mensagem, 'success');
    }
    return response;
  },
  error => {
    if (
      typeof window !== 'undefined' &&
      error?.config?.method?.toUpperCase() !== 'GET'
    ) {
      let mensagemErro = 'Erro ao realizar requisição!';
      const metodo = error?.config?.method?.toUpperCase();
      if (metodo === 'POST') {
        mensagemErro = 'Erro ao realizar cadastro!';
      } else if (metodo === 'PUT') {
        mensagemErro = 'Erro ao realizar edição!';
      } else if (metodo === 'DELETE') {
        mensagemErro = 'Erro ao realizar remoção!';
      }
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        mensagemErro;
      showFloatingNotification(msg, 'error');
    }
    return Promise.reject(error);
  }
);

export default api;
