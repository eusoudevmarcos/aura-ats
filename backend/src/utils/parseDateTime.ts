export function parseDateTime(input: string | Date): Date {
  if (!input) throw new Error("Data inválida");

  let date: Date;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string") {
    // Tenta criar um Date diretamente
    date = new Date(input);

    if (isNaN(date.getTime())) {
      // Tenta converter formatos brasileiros
      // dd/MM/YYYY ou dd/MM/YYYY HH:mm
      const match = input.match(
        /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?$/
      );
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // JS months 0-index
        const year = parseInt(match[3], 10);
        const hour = match[4] ? parseInt(match[4], 10) : 0;
        const minute = match[5] ? parseInt(match[5], 10) : 0;
        date = new Date(year, month, day, hour, minute);
      } else {
        throw new Error("Formato de data inválido");
      }
    }
  } else {
    throw new Error("Formato de data inválido");
  }

  if (isNaN(date.getTime())) throw new Error("Data inválida");

  return date;
}
