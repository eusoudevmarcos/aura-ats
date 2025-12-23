type FieldOperator = "some" | "every" | "none";
type FieldSpec = string | { [key: string]: FieldOperator };

// Agora o SearchParam permite informar se o campo é enum via novo parâmetro opcional: enums
interface SearchParam {
  search: string | number | Date | Array<string | number | Date>;
  fields: Array<FieldSpec>;
  enums?: string[]; // lista de campos (ou paths) que são enums
  [key: string]: any;
}

// O AdvancedFieldParam pode passar um objeto extra para enums usando "_enums" (ex: { _enums: ["status"] })
type AdvancedFieldParam = {
  _enums?: string[];
  [field: string]:
    | {
        search: string | number | Date | Array<string | number | Date>;
        OR?: boolean;
        AND?: boolean;
        enum?: boolean; // suporte por campo
      }
    | any;
};

type BuildWhereInput = SearchParam | [string, string[]] | AdvancedFieldParam;

function buildNestedObject(path: string, value: any): any {
  const parts = path.split(".");
  let result = value;
  for (let i = parts.length - 1; i >= 0; i--) {
    result = { [parts[i]]: result };
  }
  return result;
}

function isFieldEnum(
  field: string,
  enumsParam?: string[],
  valueObj?: any
): boolean {
  // Verifica se o campo está listado na lista de enums do param ou marcação por valor individual
  // valueObj pode vir de params avançados (ex: { status: { search: ..., enum: true } })
  if (Array.isArray(enumsParam) && enumsParam.includes(field)) return true;
  if (valueObj && typeof valueObj === "object" && valueObj.enum === true)
    return true;
  return false;
}

/**
 * buildWhere aprimorado -- agora suporta busca para enums!
 * - Use enums: [] no SearchParam, ou _enums: [] nos param avançados, ou enum: true por campo.
 */
export function buildWhere<TWhereInput extends Record<string, any>>(
  ...params: BuildWhereInput[]
): TWhereInput {
  const orConditions: Record<string, any>[] = [];
  const andConditions: Record<string, any>[] = [];

  params.forEach((param) => {
    // Descobrir lista global de enums (para params avançados)
    let advancedEnums: string[] | undefined;
    if (
      typeof param === "object" &&
      !Array.isArray(param) &&
      param._enums &&
      Array.isArray(param._enums)
    ) {
      advancedEnums = param._enums;
    }

    // --------------------------
    // Compatibilidade com formato avançado { campo1: { search, OR/AND?, enum? } }
    // Suporta path aninhado (ex: "cliente.empresa.cnpj")
    // --------------------------
    if (
      typeof param === "object" &&
      !Array.isArray(param) &&
      param.fields === undefined &&
      param.search === undefined
    ) {
      Object.entries(param).forEach(([field, value]) => {
        if (field === "_enums") return; // ignora esse meta
        if (
          typeof value === "object" &&
          value !== null &&
          "search" in value &&
          value.search !== undefined
        ) {
          let search = value.search;
          const useOr = value.OR === true || value.or === true;
          const useAnd = value.AND === true || value.and === true;
          const enumField = isFieldEnum(field, advancedEnums, value);

          if (Array.isArray(search)) {
            // Prisma para enum usa { field: { in: [..] } }, mas SEM mode/contains!
            const cond = buildNestedObject(
              field,
              enumField
                ? { in: search }
                : {
                    in: search.map((it: any) =>
                      typeof it === "string"
                        ? { contains: it, mode: "insensitive" }
                        : it
                    ),
                  }
            );
            (useOr
              ? orConditions
              : useAnd
              ? andConditions
              : andConditions
            ).push(cond);
            return;
          }

          // Se enum: sempre equals, não contains nem modo insensitive
          let condition: any;
          if (enumField) {
            condition = { equals: search };
          } else if (typeof search === "number") {
            condition = { equals: search };
          } else if (search instanceof Date) {
            condition = { equals: search };
          } else if (typeof search === "string") {
            condition = { contains: search, mode: "insensitive" };
          } else {
            condition = { equals: search };
          }

          const cond = buildNestedObject(field, condition);
          (useOr ? orConditions : useAnd ? andConditions : andConditions).push(
            cond
          );
        } else if (typeof value === "string" || typeof value === "number") {
          const cond = buildNestedObject(field, value);
          andConditions.push(cond);
        }
      });
      return;
    }

    // ---------------------------------
    // Compatibilidade formato antigo: [search, fields]
    // ---------------------------------
    let search: any, fields: FieldSpec[], enumsParam: string[] | undefined;
    if (
      Array.isArray(param) &&
      typeof param[0] === "string" &&
      Array.isArray(param[1])
    ) {
      search = param[0];
      fields = param[1];
    } else if ((param as SearchParam).fields !== undefined) {
      search = (param as SearchParam).search;
      fields = (param as SearchParam).fields;
      enumsParam = (param as SearchParam).enums;
    } else {
      return;
    }

    if (
      search === undefined ||
      search === null ||
      (typeof search === "string" && search.trim() === "") ||
      !fields?.length
    )
      return;

    fields.forEach((fieldSpec) => {
      let fieldPath: string;
      let arrayOp: FieldOperator | undefined;
      if (typeof fieldSpec === "string") {
        fieldPath = fieldSpec;
      } else {
        fieldPath = Object.keys(fieldSpec)[0];
        arrayOp = Object.values(fieldSpec)[0];
      }
      const isEnum = isFieldEnum(fieldPath, enumsParam);

      const parts = fieldPath.split(".");

      if (Array.isArray(search)) {
        search.forEach((searchItem) => {
          let condition: any;
          if (isEnum) {
            condition = { equals: searchItem };
          } else if (typeof searchItem === "number") {
            condition = { equals: searchItem };
          } else if (searchItem instanceof Date) {
            condition = { equals: searchItem };
          } else if (typeof searchItem === "string") {
            condition = { contains: searchItem, mode: "insensitive" };
          } else {
            condition = { equals: searchItem };
          }
          // Montar estrutura aninhada
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
      } else {
        let condition: any;
        if (isEnum) {
          condition = { equals: search };
        } else if (typeof search === "number") {
          condition = { equals: search };
        } else if (search instanceof Date) {
          condition = { equals: search };
        } else if (typeof search === "string") {
          condition = { contains: search, mode: "insensitive" };
        } else {
          condition = { equals: search };
        }
        let nested = condition;
        for (let i = parts.length - 1; i >= 0; i--) {
          const key = parts[i];
          if (i === parts.length - 1 && arrayOp) {
            nested = { [arrayOp]: nested };
          }
          nested = { [key]: nested };
        }
        orConditions.push(nested);
      }
    });
  });

  if (orConditions.length > 0 && andConditions.length > 0) {
    return {
      AND: [
        {
          ...(andConditions.length === 1
            ? andConditions[0]
            : { AND: andConditions }),
        },
        { OR: orConditions },
      ],
    } as unknown as TWhereInput;
  } else if (orConditions.length > 0) {
    return { OR: orConditions } as unknown as TWhereInput;
  } else if (andConditions.length > 0) {
    if (andConditions.length === 1) return andConditions[0] as TWhereInput;
    return { AND: andConditions } as unknown as TWhereInput;
  }
  return {} as TWhereInput;
}

/**
 * EXEMPLOS DE USO:
 *
 * // 1. Buscar por string em dois campos:
 * buildWhere(
 *   { search: "engenheiro", fields: ["titulo", "descricao"] }
 * );
 *
 * // 2. Buscar por três coisas ao mesmo tempo (valor em UF, texto, e número):
 * buildWhere(
 *   { search: "SP", fields: ["localizacao.uf"] },
 *   { search: "engenheiro", fields: ["titulo", "descricao"] },
 *   { search: 1000, fields: ["salario"] }
 * );
 *
 * // 3. Buscar em campo relacional (some):
 * buildWhere(
 *   { search: "computador", fields: [ { "habilidades.nome": "some" } ] }
 * );
 *
 * // 4. Usando o formato antigo (array):
 * buildWhere(
 *   ["engenheiro", ["titulo", "descricao"]],
 *   ["SP", ["localizacao.uf"]]
 * );
 *
 * // 5. Suporte para enums:
 * buildWhere(
 *   { search: "ATIVO", fields: ["status"], enums: ["status"] }
 * );
 * buildWhere(
 *   { status: { search: "ATIVO", OR: true, enum: true } }
 * );
 * buildWhere(
 *   { _enums: ["status"], status: { search: "ATIVO" } }
 * );
 * buildWhere(
 *   { status: { search: ["ATIVO", "OUTRO"], OR: true, enum: true } }
 * );
 */
