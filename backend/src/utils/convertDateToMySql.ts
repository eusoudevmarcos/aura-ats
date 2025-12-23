type FormatDateOptions = {
  withTime?: boolean;
};

export function formatDatePtBR(
  value: string | Date | null | undefined,
  options: FormatDateOptions = {}
): string {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) return "";

  const { withTime = false } = options;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime && {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }).format(date);
}
