import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";

export const normalizeData = (data: any) => {
  let newData = { ...data };

  if (data?.funcionario.pessoa) {
    if (data?.funcionario.pessoa?.cpf) {
      newData.funcionario.pessoa = {
        ...newData.funcionario.pessoa,
        cpf: data.funcionario.pessoa.cpf.replace(/\D/g, ""),
      };
    } else {
      newData.funcionario.pessoa = { ...newData.funcionario.pessoa };
    }
    newData.funcionario.pessoa = convertAnyDateToPostgres(
      newData.funcionario.pessoa
    );
  }

  if (data?.funcionario.pessoaId) {
    newData.funcionario.pessoa = { id: data.funcionario.pessoaId };
  }

  // Normaliza dados de empresa
  if (data?.cliente.empresa) {
    if (data?.cliente.empresa?.cnpj) {
      newData.cliente.empresa = {
        ...newData.cliente.empresa,
        cnpj: data.cliente.empresa.cnpj.replace(/\D/g, ""),
      };
    } else {
      newData.cliente.empresa = { ...newData.cliente.empresa };
    }
    newData.cliente.empresa = convertAnyDateToPostgres(newData.cliente.empresa);
  }

  if (data?.cliente.empresaId) {
    if (!newData.cliente.empresa) newData.cliente.empresa = {};
    newData.cliente.empresa = { id: data.cliente.empresaId };
  }

  return newData;
};
