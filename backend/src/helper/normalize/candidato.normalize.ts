import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";

export const normalizeCandidatoData = (data: any) => {
  let newData = {
    ...data,
    pessoa: data.pessoa
      ? {
          ...data.pessoa,
          cpf: data.pessoa.cpf?.replace(/\D/g, ""),
          rg: data.pessoa.rg?.replace(/\D/g, ""),
          dataNascimento: convertAnyDateToPostgres(data.pessoa.dataNascimento),
        }
      : undefined,
  };

  return newData;
};
