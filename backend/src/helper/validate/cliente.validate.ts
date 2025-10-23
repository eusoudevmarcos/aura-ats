export const validateBasicFieldsCliente = (data: any): void => {
  if (!data.empresa && !data.empresaId) {
    throw new Error(
      "Dados da empresa (ID ou objeto) são obrigatórios para um cliente."
    );
  }

  if (!data.status) {
    throw new Error("Status é obrigatório.");
  }

  // Validação específica para criação de nova empresa
  if (!data.id && data.empresa && !data.empresaId) {
    if (
      !data.empresa.representantes ||
      data.empresa.representantes.length === 0
    ) {
      throw new Error(
        "Ao criar uma nova empresa, é obrigatório informar pelo menos um representante."
      );
    }
  }
};
