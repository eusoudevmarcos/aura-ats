import { ClienteWithEmpresaAndVagaInput } from '@/schemas/cliente.schema';
import { KanbanVagaResponse } from '@/schemas/vaga.schema';
import api from '.';

export const getClienteById = async (
  uuid: string /* uuid */
): Promise<ClienteWithEmpresaAndVagaInput> => {
  const response = await api.get(`/api/externalWithAuth/cliente/${uuid}`);
  return response.data;
};

export const getVagasClienteById = async (
  uuid: string /* uuid */
): Promise<KanbanVagaResponse> => {
  const response = await api.get(`/api/externalWithAuth/vaga/cliente/${uuid}`);
  return response.data.data;
};

export const saveCliente = async ({ payload }: any) => {
  const response = await api.post(
    '/api/externalWithAuth/cliente/save',
    payload
  );

  return response;
};
