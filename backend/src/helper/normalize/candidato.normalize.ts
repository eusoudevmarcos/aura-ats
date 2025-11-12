import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";

export const normalizeCandidatoData = (data: any) => {
  const dataNascimento =
    data.pessoa.dataNascimento !== "" && data.pessoa.dataNascimento
      ? convertAnyDateToPostgres(data.pessoa.dataNascimento)
      : null;

  let newData = {
    ...data,
    pessoa: data.pessoa
      ? {
          ...data.pessoa,
          cpf: data.pessoa.cpf?.replace(/\D/g, ""),
          rg: data.pessoa.rg?.replace(/\D/g, ""),
          dataNascimento: dataNascimento,
        }
      : undefined,
  };

  return newData;
};
