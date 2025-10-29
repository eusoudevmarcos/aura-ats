import api from '.';

export const getPlanos = async () => {
  const response = await api.get('/api/externalWithAuth/planos');

  return response;
};
