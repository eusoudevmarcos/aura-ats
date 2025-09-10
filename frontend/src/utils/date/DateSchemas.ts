import { z } from 'zod';

export const isoDateWithValidations = z
  .string('Data inválida')
  .refine(dateString => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  }, 'Data não pode ser futura');

// Para idade mínima
export const birthDateISOSchema = z
  .string('Data de nascimento inválida')
  .refine(dateString => {
    const birthDate = new Date(dateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18;
  }, 'Deve ter pelo menos 18 anos');

export const brazilianDateSchema = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve estar no formato DD/MM/AAAA')
  .refine(dateString => {
    const [dia, mes, ano] = dateString.split('/').map(Number);

    // Validações básicas
    if (dia < 1 || dia > 31) return false;
    if (mes < 1 || mes > 12) return false;
    if (ano < 1900 || ano > 2100) return false;

    // Verifica se a data realmente existe
    const data = new Date(ano, mes - 1, dia);
    return (
      data.getFullYear() === ano &&
      data.getMonth() === mes - 1 &&
      data.getDate() === dia
    );
  }, 'Data inválida');

// Com validação de não ser futura
export const brazilianDateNotFuture = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data deve estar no formato DD/MM/AAAA')
  .refine(dateString => {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }, 'Data inválida')
  .refine(dateString => {
    const [day, month, year] = dateString.split('/').map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return inputDate <= today;
  }, 'Data não pode ser futura');

export const hybridDateSchema = z
  .string()
  .refine(value => {
    // Testa se é formato ISO (YYYY-MM-DD)
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
    // Testa se é formato BR (DD/MM/YYYY)
    const brRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    return isoRegex.test(value) || brRegex.test(value);
  }, 'Data deve estar no formato DD/MM/AAAA ou AAAA-MM-DD')
  .refine(value => {
    let date: Date;

    if (value.includes('/')) {
      // Formato brasileiro
      const [day, month, year] = value.split('/').map(Number);
      date = new Date(year, month - 1, day);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    } else {
      // Formato ISO
      date = new Date(value);
      return !isNaN(date.getTime());
    }
  }, 'Data inválida');

// ================================
// OPÇÃO 5: Preprocessamento para converter formato BR para Date
// ================================
export const preprocessedBrazilianDate = z.preprocess(value => {
  if (typeof value !== 'string') return value;

  // Se é formato brasileiro, converte para Date
  const brRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (brRegex.test(value)) {
    const [day, month, year] = value.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  // Se é formato ISO, converte para Date
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (isoRegex.test(value)) {
    return new Date(value);
  }

  return value;
}, z.date());
