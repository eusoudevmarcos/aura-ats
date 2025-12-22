import { Prisma } from "@prisma/client";

/**
 * Normaliza valores Decimal do Prisma para number
 * (uso controlado, apenas para exibição)
 */
export function decimalToNumber(
  value?: Prisma.Decimal | string | number | null
): number | null {
  if (value === null || value === undefined) return null;

  if (value instanceof Prisma.Decimal) {
    return value.toNumber();
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (typeof value === "number") {
    return value;
  }

  return null;
}
