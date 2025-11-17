import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";
import { normalizeClienteData } from "./cliente.normalize";

export const normalizeDataUsuarioSistema = (data: any) => {
  const newData = { ...data };

  // --- Normaliza pessoa ---
  if (data?.funcionario?.pessoa || data?.funcionario?.pessoaId) {
    newData.funcionario = { ...newData.funcionario };

    // Se tiver pessoaId, mantém o id
    if (data.funcionario.pessoaId) {
      newData.funcionario.pessoa.id = data?.funcionario?.pessoaId;
      delete newData.pessoaId;
    }

    if (newData?.funcionario?.pessoa?.dataNascimento) {
      newData.funcionario.pessoa.dataNascimento = convertAnyDateToPostgres(
        data.funcionario.pessoa.dataNascimento
      );
    }
  }

  if (data?.cliente || data?.clienteId) {
    newData.cliente = normalizeClienteData({
      ...data.cliente,
      clienteId: data.clienteId,
    });
    if (newData?.clienteId) delete newData.clienteId;
  }

  if (data.funcionario.pessoa) {
  }

  return newData;
};
