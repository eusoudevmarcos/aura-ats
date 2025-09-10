export const convertDateToPostgres = (
  dateString: string | undefined
): Date | undefined => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!dateString || dateString.length !== 10) {
    return undefined;
  }
  const parts = dateString.split('/');
  if (parts.length === 3) {
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
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      return undefined;
    }

    if (
      inputDate.getFullYear() === year &&
      inputDate.getMonth() + 1 === month &&
      inputDate.getDate() === day
    ) {
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      return new Date(`${year}-${formattedMonth}-${formattedDay}`);
    }
  }
  return undefined;
};
