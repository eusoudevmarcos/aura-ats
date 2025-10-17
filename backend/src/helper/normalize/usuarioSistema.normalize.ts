import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";

export const normalizeData = (data: any) => {
  const newData = { ...data };

  // --- Normaliza pessoa ---
  if (data?.funcionario?.pessoa || data?.funcionario?.pessoaId) {
    newData.funcionario = { ...newData.funcionario };

    // Mantém o objeto existente ou cria um vazio
    const pessoa = newData.funcionario.pessoa || {};

    // Se tiver pessoaId, mantém o id
    if (data.funcionario.pessoaId) {
      pessoa.id = data.funcionario.pessoaId;
    }

    // Normaliza CPF
    if (pessoa.cpf) {
      pessoa.cpf = pessoa.cpf.replace(/\D/g, "");
    }

    // Converte datas
    newData.funcionario.pessoa.dataNascimento = convertAnyDateToPostgres(
      pessoa.dataNascimento
    );
  }

  // --- Normaliza empresa ---
  if (data?.cliente?.empresa || data?.cliente?.empresaId) {
    newData.cliente = { ...newData.cliente };

    const empresa = newData.cliente.empresa || {};

    // Se tiver empresaId, mantém o id
    if (data.cliente.empresaId) {
      empresa.id = data.cliente.empresaId;
    }

    // Normaliza CNPJ
    if (empresa.cnpj) {
      empresa.cnpj = empresa.cnpj.replace(/\D/g, "");
    }

    // Converte datas
    newData.cliente.empresa = convertAnyDateToPostgres(empresa);
  }

  return newData;
};
