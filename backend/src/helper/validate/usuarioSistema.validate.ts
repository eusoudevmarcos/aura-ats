export const validateBasicFields = (data: any): void => {
  if (!data.email) throw new Error("E-mail é obrigatório.");
  if (!data.tipoUsuario) throw new Error("Tipo de usuário é obrigatório.");
  if (!data.password)
    throw new Error("Senha é obrigatória para criação de usuário.");
  if (
    !data.funcionario?.pessoa &&
    !data.funcionario?.pessoaId &&
    !data?.cliente?.empresa &&
    !data.cliente.empresaId
  ) {
    throw new Error("Dados de Pessoa ou Empresa são obrigatórios.");
  }
  if (
    (data?.funcionario?.pessoa || data?.funcionario?.pessoaId) &&
    (data?.cliente?.empresa || data?.cliente?.empresaId)
  ) {
    throw new Error(
      "Usuário não pode ter dados de Pessoa e Empresa simultaneamente."
    );
  }
};
