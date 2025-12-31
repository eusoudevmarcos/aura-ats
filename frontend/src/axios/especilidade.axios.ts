import api from './index';

// Tipos opcionais para tipar as especialidades
export interface Especialidade {
  id: number;
  nome: string;
  sigla: string;
}

export interface EspecialidadeCreate {
  nome: string;
  sigla: string;
}

export interface EspecialidadeUpdate {
  nome?: string;
  sigla?: string;
}

// Buscar todas as especialidades
export const listarEspecialidades = async (): Promise<Especialidade[]> => {
  const response = await api.get<Especialidade[]>(
    '/api/external/especialidade'
  );
  return response.data;
};

// Buscar especialidade por ID
export const buscarEspecialidadePorId = async (
  id: number
): Promise<Especialidade> => {
  const response = await api.get<Especialidade>(
    `/api/external/especialidade/${id}`
  );
  return response.data;
};

// Criar nova especialidade
export const criarEspecialidade = async (
  data: EspecialidadeCreate
): Promise<Especialidade> => {
  const response = await api.post<Especialidade>(
    '/api/external/especialidade',
    data
  );
  return response.data;
};

// Atualizar especialidade existente
export const atualizarEspecialidade = async (
  id: number,
  data: EspecialidadeUpdate
): Promise<Especialidade> => {
  const response = await api.put<Especialidade>(
    `/api/external/especialidade/${id}`,
    data
  );
  return response.data;
};

// Remover especialidade
export const removerEspecialidade = async (id: number): Promise<void> => {
  await api.delete(`/api/external/especialidade/${id}`);
};
