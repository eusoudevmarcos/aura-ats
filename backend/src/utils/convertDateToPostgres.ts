/**
 * Converte qualquer valor em Date válido para Postgres, recursivamente.
 * Aceita strings "dd/MM/yyyy", "dd/MM/yyyy HH:mm:ss", "yyyy-MM-dd" (com ou sem hora) ou objetos Date.
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
    // Tenta "dd/MM/yyyy HH:mm:ss" ou "dd/MM/yyyy"
    const dateTimeRegex =
      /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/;
    const match = value.match(dateTimeRegex);

    if (match) {
      const day = Number(match[1]);
      const month = Number(match[2]);
      const year = Number(match[3]);
      const hour = Number(match[4] ?? "0");
      const minute = Number(match[5] ?? "0");
      const second = Number(match[6] ?? "0");

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
        const date = new Date(year, month - 1, day, hour, minute, second);
        if (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        ) {
          return date;
        }
      }
    }

    // Tenta ISO / "yyyy-MM-dd" (com ou sem hora)
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
