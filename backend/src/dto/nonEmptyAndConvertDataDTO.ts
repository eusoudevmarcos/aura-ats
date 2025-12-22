import { Prisma } from "@prisma/client";
import { formatDecimal } from "../utils/formatCurrencyBRL";

type LocaleOptions = {
  locale?: string;
  dateOptions?: Intl.DateTimeFormatOptions;
};

function filtrarValores(
  obj: any,
  { locale = "pt-BR", dateOptions }: LocaleOptions = {}
): any {
  // Array → recursivo
  if (Array.isArray(obj)) {
    const filtrado = obj
      .map((item) => filtrarValores(item, { locale, dateOptions }))
      .filter((item) => item !== undefined);

    return filtrado.length > 0 ? filtrado : undefined;
  }

  // Date
  if (obj instanceof Date) {
    return obj.toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      ...dateOptions,
    });
  }

  // Prisma.Decimal
  if (obj instanceof Prisma.Decimal) {
    return formatDecimal(obj);
  }

  // String (data ISO ou BR)
  if (typeof obj === "string") {
    const regexDataBR = /^\d{2}\/\d{2}\/\d{4}$/;
    const regexDataISO = /^\d{4}-\d{2}-\d{2}$/;

    if (regexDataBR.test(obj)) {
      const [day, month, year] = obj.split("/").map(Number);
      const parsed = new Date(year, month - 1, day);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString(locale, dateOptions);
      }
    }

    if (regexDataISO.test(obj)) {
      const parsed = new Date(obj);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString(locale, dateOptions);
      }
    }

    return obj;
  }

  // Object → recursivo com regra por chave
  if (obj !== null && typeof obj === "object") {
    const novoObj: any = {};

    Object.entries(obj).forEach(([key, value]) => {
      let valorFiltrado;

      // Regra específica para salário
      // if (key.toLowerCase().includes("salario")) {
      //   valorFiltrado = formatCurrencyBRL(value as any);
      // } else

      if (value instanceof Prisma.Decimal) {
        valorFiltrado = formatDecimal(value);
      } else {
        valorFiltrado = filtrarValores(value, { locale, dateOptions });
      }

      if (valorFiltrado !== null && valorFiltrado !== undefined) {
        novoObj[key] = valorFiltrado;
      }
    });

    return Object.keys(novoObj).length > 0 ? novoObj : undefined;
  }

  // Primitivos válidos
  if (obj !== null && obj !== undefined) {
    return obj;
  }

  return undefined;
}

export default function nonEmptyAndConvertDataDTO(
  usuarioSistema: any,
  options: LocaleOptions = {}
) {
  return filtrarValores(usuarioSistema, options) || {};
}
