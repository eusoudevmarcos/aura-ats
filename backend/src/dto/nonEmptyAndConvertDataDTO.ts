type LocaleOptions = {
  locale?: string;
  dateOptions?: Intl.DateTimeFormatOptions;
};

function filtrarValores(
  obj: any,
  { locale = "pt-BR", dateOptions }: LocaleOptions = {}
): any {
  // Se for array → processa cada item recursivamente
  if (Array.isArray(obj)) {
    const filtrado = obj
      .map((item) => filtrarValores(item, { locale, dateOptions }))
      .filter((item) => item !== undefined);
    return filtrado.length > 0 ? filtrado : undefined;
  }

  // Se for Date → converte
  if (obj instanceof Date) {
    return obj.toLocaleString(locale, {
      ...{
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
      ...dateOptions,
    });
  }

  // Se for string parseável como data → converte
  if (typeof obj === "string") {
    const regexDataBR = /^\d{2}\/\d{2}\/\d{4}$/;
    const regexDataISO = /^\d{4}-\d{2}-\d{2}$/; // '1998-09-01'

    if (regexDataBR.test(obj)) {
      // "01/09/1998"
      const parts = obj.split("/");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const parsed = new Date(year, month, day);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString(locale, dateOptions);
      }
    } else if (regexDataISO.test(obj)) {
      // "1998-09-01"
      const parsed = new Date(obj);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString(locale, dateOptions);
      }
    }
    return obj; // string comum, mantém
  }

  // Se for objeto → processa recursivamente
  if (obj !== null && typeof obj === "object") {
    const novoObj: any = {};
    Object.keys(obj).forEach((key) => {
      const valorFiltrado = filtrarValores(obj[key], { locale, dateOptions });
      if (valorFiltrado !== null && valorFiltrado !== undefined) {
        novoObj[key] = valorFiltrado;
      }
    });
    return Object.keys(novoObj).length > 0 ? novoObj : undefined;
  }

  // Se for valor primitivo válido
  if (obj !== null && obj !== undefined) {
    return obj;
  }

  return undefined;
}

export default function nonEmptyAndConvertDataDTO(
  usuarioSistema: any,
  options: LocaleOptions = {}
) {
  const resultado = filtrarValores(usuarioSistema, options);
  return resultado || {};
}
