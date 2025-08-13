export const convertDateFromPostgres = (
  dateString: string | undefined
): string | undefined => {
  if (!dateString || dateString.length !== 10) return undefined;
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);

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

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    ) {
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      return `${formattedDay}/${formattedMonth}/${year}`;
    }
  }
  return undefined;
};
