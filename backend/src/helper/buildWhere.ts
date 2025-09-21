type FieldOperator = "some" | "every" | "none";
type FieldSpec = string | { [key: string]: FieldOperator };

interface SearchParam {
  search: string | number | Date;
  fields: Array<FieldSpec>;
}

/**
 * buildWhere flexível para Prisma:
 * - Aceita múltiplos parâmetros de pesquisa
 * - Suporta campos aninhados e arrays relacionais com some/every/none
 * - Mantém compatibilidade com padrão antigo (search:string, fields:string[])
 */
export function buildWhere<TWhereInput extends Record<string, any>>(
  ...params: Array<SearchParam | [string, string[]]>
): TWhereInput {
  const orConditions: Record<string, any>[] = [];

  params.forEach((param) => {
    let search: string | number | Date;
    let fields: FieldSpec[];

    // Suporte ao padrão antigo: buildWhere(search:string, fields:string[])
    if (
      Array.isArray(param) &&
      typeof param[0] === "string" &&
      Array.isArray(param[1])
    ) {
      search = param[0];
      fields = param[1];
    } else {
      search = (param as SearchParam).search;
      fields = (param as SearchParam).fields;
    }

    if (!search || !fields || fields.length === 0) return;

    fields.forEach((fieldSpec) => {
      let fieldPath: string;
      let arrayOp: FieldOperator | undefined;

      if (typeof fieldSpec === "string") {
        fieldPath = fieldSpec;
      } else {
        // Se for objeto, pega a chave e operador
        fieldPath = Object.keys(fieldSpec)[0];
        arrayOp = Object.values(fieldSpec)[0];
      }

      const parts = fieldPath.split(".");

      // Monta a condição base
      let condition: any;
      // const numeric = Number(search);
      // if (!isNaN(numeric)) {
      //   // Datas ou números
      //   condition = {
      //     gte: new Date(numeric, 0, 1),
      //     lte: new Date(numeric, 11, 31, 23, 59, 59, 999),
      //   };
      // } else {
      // Texto
      condition = { contains: search, mode: "insensitive" };
      // }

      // Monta objeto aninhado, aplicando operador para arrays relacionais
      let nested = condition;
      for (let i = parts.length - 1; i >= 0; i--) {
        const key = parts[i];
        if (i === parts.length - 1 && arrayOp) {
          nested = { [arrayOp]: nested };
        }
        nested = { [key]: nested };
      }

      orConditions.push(nested);
    });
  });

  if (orConditions.length === 0) return {} as TWhereInput;
  return { OR: orConditions } as unknown as TWhereInput;
}
