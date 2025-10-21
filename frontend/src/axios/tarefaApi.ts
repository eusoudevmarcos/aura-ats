import api from './index';

export interface Tarefa {
  id?: number;
  idUsuarioSistema: string;
  descricao: string;
  concluida: boolean;
  orderBy: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TarefaInput {
  id?: number;
  descricao: string;
  concluida?: boolean;
  orderBy?: number;
}

export const tarefaApi = {
  // Buscar todas as tarefas do usuário logado
  getAll: async (): Promise<Tarefa[]> => {
    const response = await api.get('/api/externalWithAuth/tarefa');
    return response.data;
  },

  // Buscar tarefa por ID
  getById: async (id: number): Promise<Tarefa> => {
    const response = await api.get(`/api/externalWithAuth/tarefa/${id}`);
    return response.data;
  },

  // Salvar tarefa (criar ou atualizar)
  save: async (data: TarefaInput): Promise<Tarefa> => {
    const response = await api.post('/api/externalWithAuth/tarefa', data);
    return response.data;
  },

  // Deletar tarefa
  delete: async (id: number): Promise<void> => {
    await api.delete('/api/externalWithAuth/tarefa', { data: { id } });
  },

  // Atualizar ordem das tarefas
  updateOrder: async (
    tarefas: { id: number; orderBy: number }[]
  ): Promise<void> => {
    await api.put('/api/externalWithAuth/tarefa/order', { tarefas });
  },
};
