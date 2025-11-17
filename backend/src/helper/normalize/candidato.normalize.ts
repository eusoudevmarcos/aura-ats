import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";

export const normalizeCandidatoData = (data: any) => {
  const dataNascimento =
    data.pessoa.dataNascimento !== "" && data.pessoa.dataNascimento
      ? convertAnyDateToPostgres(data.pessoa.dataNascimento)
      : null;

  if (data.medico.crm.length > 0) {
    data.medico.crm = data.medico.crm.map((crm: any) => ({
      ...crm,
      numero: Number(crm.numero) || null,
      dataInscricao: convertAnyDateToPostgres(crm.dataInscricao),
    }));

    if (
      data.medico.quadroSocietario !== null &&
      data.medico.quadroSocietario !== undefined
    ) {
      data.medico.quadroSocietario =
        data.medico.quadroSocietario === "true" ? true : false;
    }
  }

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
