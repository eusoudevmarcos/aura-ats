import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";

export const normalizeClienteData = (data: any) => {
  let newData = {
    ...data,
    empresa: data.empresa
      ? {
          ...data.empresa,
          cnpj: data.empresa.cnpj?.replace(/\D/g, ""),
          representantes: data.empresa.representantes?.map((rep: any) => ({
            ...rep,
            cpf: rep.cpf?.replace(/\D/g, ""),
          })),
        }
      : undefined,
  };

  newData.empresa = convertAnyDateToPostgres(newData.empresa);

  return newData;
};
