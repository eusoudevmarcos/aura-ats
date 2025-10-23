export const normalizeDataUsuarioSistema = (data: any) => {
  const newData = { ...data };

  // --- Normaliza pessoa ---
  if (data?.funcionario?.pessoa || data?.funcionario?.pessoaId) {
    newData.funcionario = { ...newData.funcionario };

    // Mantém o objeto existente ou cria um vazio
    const pessoa = newData.funcionario.pessoa || {};

    // Se tiver pessoaId, mantém o id
    if (data.funcionario.pessoaId) {
      pessoa.id = data?.funcionario?.pessoaId;
    }
  }

  // --- Normaliza empresa ---
  if (data?.cliente || data?.clienteId) {
    newData.cliente = { ...newData.cliente };

    if (data.clienteId) {
      newData.cliente.id = data.clienteId;
    }
  }

  return newData;
};
