import { Prisma } from "@prisma/client";
import { decimalToNumber } from "./decimal";

export function formatCurrencyBRL(
  value?: Prisma.Decimal | string | number | null,
  fallback = "Não informado"
): string {
  const numberValue = decimalToNumber(value);

  if (numberValue === null) return fallback;

  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatDecimal(
  value?: Prisma.Decimal | string | number | null,
  options?: Intl.NumberFormatOptions,
  fallback = "Não informado"
): string {
  const numberValue = decimalToNumber(value);

  if (numberValue === null) return fallback;

  return numberValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });
}
