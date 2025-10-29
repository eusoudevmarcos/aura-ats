import api from '.';

export const getClienteById = async (uuid: string /* uuid */) => {
  const response = await api.get(`/api/externalWithAuth/cliente/${uuid}`);
  return response.data;
};

export const saveCliente = async ({ payload }: any) => {
  const response = await api.post(
    '/api/externalWithAuth/cliente/save',
    payload
  );

  return response;
};
