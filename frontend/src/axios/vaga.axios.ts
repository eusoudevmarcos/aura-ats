import { KanbanVagaResponse } from '@/schemas/vaga.schema';
import api from '.';

interface Pagination {
  search?: string;
  page: number;
  pageSize: number;
  totalPaginas: number;
}

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  dataPublicacao: string;
  create_at: string;
  update_at: string;
  categoria: string;
  status: string;
  tipoContrato: string;
  tipoSalario: string;
  clienteId: string;
  localizacaoId: string;
  localizacao: {
    id: string;
    cidade: string;
    uf: string;
  };
  _count: {
    candidaturas: number;
  };
}

export const getVagasClienteById = async (
  clienteId: string,
  { page = 1, pageSize = 5, search = '' }: any
) => {
  const vagasCliente = await api.get(
    `/api/externalWithAuth/vaga/cliente/${clienteId}`,
    { params: { page, pageSize, search } }
  );

  return vagasCliente.data;
};

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  label?: string;
  draggable?: boolean;
  metadata?: Record<string, any>;
}

export interface KanbanLane {
  id: string;
  title: string;
  label: string;
  cards: KanbanCard[];
}

export interface KanbanResponse {
  lanes: KanbanLane[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export const getVagasKanban = async ({
  page = 1,
  pageSize = 5,
  ...params
}): Promise<KanbanVagaResponse> => {
  const vagasCliente = await api.get('/api/externalWithAuth/vaga/kanban', {
    params: { page, pageSize, ...params },
  });

  return vagasCliente.data;
};

export const getVagas = async ({ page = 1, pageSize = 5, ...params }) => {
  const vagasCliente = await api.get('/api/externalWithAuth/vaga', {
    params: { page, pageSize, ...params },
  });

  return vagasCliente.data;
};

export const getHistoricoVaga = async (
  vagaId: string,
  { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}
) => {
  const response = await api.get(
    `/api/externalWithAuth/vaga/${vagaId}/historico`,
    {
      params: { page, pageSize },
    }
  );

  return response.data;
};

/**
 * Atualiza o status de uma vaga pelo ID
 * @param {string} id - ID da vaga
 * @param {string} status - Novo status
 * @returns {Promise<any>}
 */
export const patchVagaStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}): Promise<any> => {
  const response = await api.patch(`/api/externalWithAuth/vaga/status`, {
    id,
    status,
  });
  return response.data;
};
