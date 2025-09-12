import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";

export const normalizeData = (data: any) => {
  let newData = {
    ...data,
    pessoa: {
      ...data.pessoa,
      cpf: data.pessoa.cpf?.replace(/\D/g, ""),
    },
    empresa: data.empresa
      ? {
          ...data.empresa,
          cnpj: data.empresa.cnpj?.replace(/\D/g, ""),
        }
      : undefined,
  };

  newData = convertAnyDateToPostgres(newData);

  return newData;
};
