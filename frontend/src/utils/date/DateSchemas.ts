import { z } from 'zod';

// Schema básico para Date
export const dateSchema = z
  .date({
    error: 'Data é obrigatória',
  })
  .refine(date => {
    const year = date.getFullYear();
    return year >= 1900 && year <= 2100;
  }, 'Data deve estar entre 1900 e 2100');

// Schema opcional para Date
export const optionalDateSchema = z
  .date({
    error: 'Formato de data inválido',
  })
  .optional()
  .nullable();

// Schema com validações customizadas
export const customDateSchema = z
  .date({
    error: 'Data de nascimento é obrigatória',
  })
  .refine(date => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 0 && age <= 120;
  }, 'Data deve ser válida (0-120 anos)')
  .refine(date => {
    const today = new Date();
    return date <= today;
  }, 'Data não pode ser futura');
