// Função que valida e converte string "dd/MM/yyyy" para Date
export const convertDateToPostgres = (
  dateString: string | undefined
): Date | undefined => {
  if (!dateString || dateString.length !== 10) {
    return undefined;
  }

  const parts = dateString.split("/");
  if (parts.length !== 3) return undefined;

  const [day, month, year] = parts.map(Number);

  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > 2100
  ) {
    return undefined;
  }

  const inputDate = new Date(year, month - 1, day);

  if (
    inputDate.getFullYear() !== year ||
    inputDate.getMonth() !== month - 1 ||
    inputDate.getDate() !== day
  ) {
    return undefined;
  }

  return inputDate; // Prisma e Postgres entendem Date diretamente
};

// Função recursiva para processar qualquer objeto/array
function deepConvertDatesToPostgres(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepConvertDatesToPostgres(item));
  }

  if (obj instanceof Date) {
    return obj; // já é Date
  }

  if (typeof obj === "string") {
    const converted = convertDateToPostgres(obj);
    return converted ?? obj; // se não for data válida, mantém a string
  }

  if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = deepConvertDatesToPostgres(obj[key]);
    }
    return newObj;
  }

  return obj;
}

export function convertAnyDateToPostgres(prop: any) {
  const resultado = deepConvertDatesToPostgres(prop);
  return resultado || {};
}
