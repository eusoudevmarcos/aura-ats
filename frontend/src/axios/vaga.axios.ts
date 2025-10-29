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

export const getVagas = async ({ page = 1, pageSize = 5, search = '' }) => {
  const vagasCliente = await api.get('/api/externalWithAuth/vaga', {
    params: { page, pageSize, search },
  });

  return vagasCliente.data;
};
