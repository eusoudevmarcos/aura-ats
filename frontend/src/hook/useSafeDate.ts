import { useEffect, useState } from 'react';

/**
 * Hook para formatação segura de datas que evita problemas de hidratação
 * Garante que a formatação só aconteça no cliente
 */
export function useSafeDate(date: Date | string | null | undefined) {
  const [mounted, setMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && date) {
      try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (!isNaN(dateObj.getTime())) {
          setFormattedDate(dateObj.toLocaleDateString('pt-BR'));
        } else {
          setFormattedDate('Data inválida');
        }
      } catch (error) {
        setFormattedDate('Data inválida');
      }
    }
  }, [mounted, date]);

  return mounted ? formattedDate : '';
}

/**
 * Hook para formatação segura de data e hora que evita problemas de hidratação
 */
export function useSafeDateTime(date: Date | string | null | undefined) {
  const [mounted, setMounted] = useState(false);
  const [formattedDateTime, setFormattedDateTime] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && date) {
      try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (!isNaN(dateObj.getTime())) {
          setFormattedDateTime(dateObj.toLocaleString('pt-BR'));
        } else {
          setFormattedDateTime('Data inválida');
        }
      } catch (error) {
        setFormattedDateTime('Data inválida');
      }
    }
  }, [mounted, date]);

  return mounted ? formattedDateTime : '';
}

/**
 * Hook para obter o ano atual de forma segura
 */
export function useSafeCurrentYear() {
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState<number>(2024); // Valor padrão

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setYear(new Date().getFullYear());
    }
  }, []);

  return mounted ? year : 2024;
}
