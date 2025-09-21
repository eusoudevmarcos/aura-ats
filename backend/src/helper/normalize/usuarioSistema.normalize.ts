import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";

export const normalizeData = (data: any) => {
  let newData = { ...data };

  if (data?.pessoa) {
    if (data?.pessoa?.cpf) {
      newData.pessoa = {
        ...newData.pessoa,
        cpf: data.pessoa.cpf.replace(/\D/g, ""),
      };
    } else {
      newData.pessoa = { ...newData.pessoa };
    }
    newData.pessoa = convertAnyDateToPostgres(newData.pessoa);
  }

  if (data?.pessoaId) {
    newData.pessoa = { id: data.pessoaId };
  }

  // Normaliza dados de empresa
  if (data?.empresa) {
    if (data?.empresa?.cnpj) {
      newData.empresa = {
        ...newData.empresa,
        cnpj: data.empresa.cnpj.replace(/\D/g, ""),
      };
    } else {
      newData.empresa = { ...newData.empresa };
    }
    newData.empresa = convertAnyDateToPostgres(newData.empresa);
  }

  if (data?.empresaId) {
    if (!newData.empresa) newData.empresa = {};
    newData.empresa = { id: data.empresaId };
    console.log("ENTROU AQUI");
  }

  return newData;
};
