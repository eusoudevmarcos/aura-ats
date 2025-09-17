import { convertAnyDateToPostgres } from "../../utils/convertDateToPostgres";

export const normalizeDataAgenda = (data: any) => {
  let newData = {
    ...data,
  };

  newData.dataHora = convertAnyDateToPostgres(newData.dataHora);

  return newData;
};
