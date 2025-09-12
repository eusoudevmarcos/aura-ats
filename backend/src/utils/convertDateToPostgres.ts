/**
 * Converte qualquer valor em Date válido para Postgres, recursivamente.
 * Aceita strings "dd/MM/yyyy", "yyyy-MM-dd" ou objetos Date.
 * Funciona para objetos aninhados, arrays e arrays de objetos.
 */
export function convertAnyDateToPostgres(value: any): any {
  if (Array.isArray(value)) {
    return value.map(convertAnyDateToPostgres);
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    // Tenta "dd/MM/yyyy"
    const parts = value.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      if (
        !isNaN(day) &&
        !isNaN(month) &&
        !isNaN(year) &&
        day >= 1 &&
        day <= 31 &&
        month >= 1 &&
        month <= 12 &&
        year >= 1900 &&
        year <= 2100
      ) {
        const date = new Date(year, month - 1, day);
        if (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        )
          return date;
      }
    }

    // Tenta ISO / "yyyy-MM-dd"
    const isoDate = new Date(value);
    if (!isNaN(isoDate.getTime())) return isoDate;

    return value; // Não é data, mantém string
  }

  if (value !== null && typeof value === "object") {
    const newObj: any = {};
    for (const key of Object.keys(value)) {
      newObj[key] = convertAnyDateToPostgres(value[key]);
    }
    return newObj;
  }

  return value;
}
