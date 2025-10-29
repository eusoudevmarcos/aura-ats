import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";

export const normalizeClienteData = (data: any) => {
  let newData = { ...data };

  if (data?.clienteId) {
    newData.id = data.clienteId;
    delete newData.clienteId;
  }

  if (data?.empresa) {
    newData.empresa = {
      ...data.empresa,
      cnpj: data.empresa.cnpj?.replace(/\D/g, ""),
      representantes: data.empresa.representantes?.map((rep: any) => ({
        ...rep,
        cpf: rep.cpf?.replace(/\D/g, ""),
      })),
    };

    newData.empresa = convertAnyDateToPostgres(newData.empresa);
  }

  return newData;
};
