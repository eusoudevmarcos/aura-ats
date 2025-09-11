export const convertDateToPostgres = (
  dateString: string | undefined
): Date | undefined => {
  // Log para debug
  console.log('Input dateString:', dateString);

  if (!dateString || dateString.length !== 10) {
    console.log('Invalid dateString format');
    return undefined;
  }

  const parts = dateString.split('/');
  if (parts.length !== 3) {
    console.log('Invalid date parts');
    return undefined;
  }

  const [day, month, year] = parts.map(Number);

  // Validações básicas
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
    console.log('Invalid date values:', { day, month, year });
    return undefined;
  }

  // Criar a data (month - 1 porque Date usa 0-11 para meses)
  const inputDate = new Date(year, month - 1, day);

  // Verificar se a data é válida (ex: 31/02 seria inválida)
  if (
    inputDate.getFullYear() !== year ||
    inputDate.getMonth() !== month - 1 ||
    inputDate.getDate() !== day
  ) {
    console.log('Invalid date created');
    return undefined;
  }

  // Verificar se não é data futura
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Permite datas de hoje

  if (inputDate > today) {
    console.log('Future date not allowed');
    return undefined;
  }

  // Log para debug
  console.log('Converted date:', inputDate);
  console.log('Date ISO string:', inputDate.toISOString());

  return inputDate; // Retorna o objeto Date diretamente
};
