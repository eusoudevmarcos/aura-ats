import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";

export const normalizeCandidatoData = (data: any) => {
  let dataNascimento = null;

  if (data.pessoa.dataNascimento) {
    dataNascimento = convertAnyDateToPostgres(data.pessoa.dataNascimento);
  }

  if (data?.medico) {
    if (Array.isArray(data.medico?.crm) && data.medico?.crm?.length > 0) {
      data.medico.crm = data.medico.crm.map((crm: any) => ({
        ...crm,
        numero: Number(crm.numero) || null,
        dataInscricao: convertAnyDateToPostgres(crm.dataInscricao),
      }));
    } else {
      delete data.medico.crm;
    }

    if (Array.isArray(data.medico?.especialidades)) {
      // Mantém o array mesmo se estiver vazio.
      // Regra:
      // - length > 0: envia as especialidades normalmente
      // - length === 0: indica "remover todas as especialidades" (tratado no BuildNestedOperation)
      data.medico.especialidades = data.medico.especialidades;
    }
    // else {
    //   delete data.medico.especialidades;
    // }

    if (
      data.medico?.quadroSocietario !== null &&
      data.medico?.quadroSocietario !== undefined
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
