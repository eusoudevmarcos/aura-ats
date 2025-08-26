import { z } from 'zod';

// Regex para formatos brasileiros
const regexMMYYYY = /^(\d{2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?$/;
const regexDDMMYYYY = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?$/;
const regexISO = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{1,2}):(\d{1,2}))?$/;

export const zDateValidate = z.preprocess(val => {
  // Se já for Date
  if (val instanceof Date) {
    if (isNaN(val.getTime())) throw new Error('Data inválida');
    return val;
  }

  if (typeof val !== 'string') throw new Error('Formato de data inválido');

  let day = 1,
    month = 1,
    year = 1970,
    hour = 0,
    minute = 0;

  // YYYY-MM-DD ou YYYY-MM-DDTHH:MM
  let match = val.match(regexISO);
  if (match) {
    year = parseInt(match[1], 10);
    month = parseInt(match[2], 10);
    day = parseInt(match[3], 10);
    if (match[4]) hour = parseInt(match[4], 10);
    if (match[5]) minute = parseInt(match[5], 10);
    return new Date(year, month - 1, day, hour, minute);
  }

  // MM/YYYY ou MM/YYYY h:m
  match = val.match(regexMMYYYY);
  if (match) {
    month = parseInt(match[1], 10);
    year = parseInt(match[2], 10);
    if (match[3]) hour = parseInt(match[3], 10);
    if (match[4]) minute = parseInt(match[4], 10);
    return new Date(year, month - 1, 1, hour, minute);
  }

  // dd/MM/YYYY ou dd/MM/YYYY h:m
  match = val.match(regexDDMMYYYY);
  if (match) {
    day = parseInt(match[1], 10);
    month = parseInt(match[2], 10);
    year = parseInt(match[3], 10);
    if (match[4]) hour = parseInt(match[4], 10);
    if (match[5]) minute = parseInt(match[5], 10);
    return new Date(year, month - 1, day, hour, minute);
  }

  throw new Error(
    'Formato inválido. Use YYYY-MM-DD, YYYY-MM-DDTHH:MM, MM/YYYY, MM/YYYY h:m, dd/MM/YYYY ou dd/MM/YYYY h:m'
  );
}, z.date('Data obrigatória'));
