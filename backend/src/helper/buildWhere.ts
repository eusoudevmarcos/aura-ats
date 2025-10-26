type FieldOperator = "some" | "every" | "none";
type FieldSpec = string | { [key: string]: FieldOperator };

interface SearchParam {
  search: string | number | Date | Array<string | number | Date>;
  fields: Array<FieldSpec>;
}

/**
 * buildWhere aprimorado:
 * - Suporta múltiplos parâmetros (SearchParam | [search, fields])
 * - Detecta tipos de busca (array → in, texto → contains, número → equals, etc.)
 * - Funciona com campos relacionais (some/every/none)
 */
export function buildWhere<TWhereInput extends Record<string, any>>(
  ...params: Array<SearchParam | [string, string[]]>
): TWhereInput {
  const orConditions: Record<string, any>[] = [];

  params.forEach((param) => {
    let search: any;
    let fields: FieldSpec[];

    // Compatibilidade com o formato antigo [search, fields]
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

    if (!search || !fields?.length) return;

    fields.forEach((fieldSpec) => {
      let fieldPath: string;
      let arrayOp: FieldOperator | undefined;

      if (typeof fieldSpec === "string") {
        fieldPath = fieldSpec;
      } else {
        fieldPath = Object.keys(fieldSpec)[0];
        arrayOp = Object.values(fieldSpec)[0];
      }

      const parts = fieldPath.split(".");

      // 💡 Detecta tipo do search
      let condition: any;
      if (Array.isArray(search)) {
        condition = { in: search }; // ex: [id1, id2, id3]
      } else if (typeof search === "number") {
        condition = { equals: search };
      } else if (search instanceof Date) {
        condition = { equals: search };
      } else if (typeof search === "string") {
        condition = { contains: search, mode: "insensitive" };
      } else {
        return;
      }

      // Monta estrutura aninhada
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
