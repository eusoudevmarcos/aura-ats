/**
 * Cria dinamicamente um objeto `where` para qualquer entidade Prisma.
 *
 * @param search - termo de busca
 * @param fields - lista de campos a pesquisar (pode incluir campos aninhados ex: "localizacao.cidade")
 * @returns objeto tipado para ser usado em qualquer findMany / count
 */
// Sobrecargas
export function buildWhere<TWhereInput extends Record<string, any>>(
  search: string,
  fields: string[]
): TWhereInput;
export function buildWhere<TWhereInput extends Record<string, any>>(
  filters: Record<string, unknown>,
  aliases?: Record<string, string>
): TWhereInput;

// Implementação
export function buildWhere<TWhereInput extends Record<string, any>>(
  arg1: string | Record<string, unknown>,
  arg2?: string[] | Record<string, string>
): TWhereInput {
  // Modo 1: busca textual genérica (mantém compatibilidade)
  if (typeof arg1 === "string" && Array.isArray(arg2)) {
    const search = arg1;
    const fields = arg2;

    if (!search || !search.trim() || fields.length === 0) {
      return {} as TWhereInput;
    }

    const orConditions = fields.map((field) => {
      const parts = field.split(".");

      if (parts.length === 1) {
        return {
          [parts[0]]: { contains: search, mode: "insensitive" },
        };
      } else {
        return parts.reverse().reduce((acc, key, idx) => {
          if (idx === 0) {
            return { [key]: { contains: search, mode: "insensitive" } };
          }
          return { [key]: acc };
        }, {} as Record<string, unknown>);
      }
    });

    return { OR: orConditions } as unknown as TWhereInput;
  }

  // Modo 2: objeto de filtros { campo: valor } com suporte a campos aninhados
  const filters = (arg1 ?? {}) as Record<string, unknown>;
  const aliasMap: Record<string, string> =
    arg2 && !Array.isArray(arg2) ? (arg2 as Record<string, string>) : {};
  const andConditions: Record<string, unknown>[] = [];

  for (const [fieldPath, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;

    const path = aliasMap[fieldPath] ?? fieldPath;
    const parts = path.split(".");

    // Construção usando equals por padrão (evita erro em enums/numéricos)
    const leafCondition: Record<string, unknown> = { equals: value };

    const condition = parts
      .slice()
      .reverse()
      .reduce(
        (acc, key) => ({ [key]: acc }),
        leafCondition as Record<string, unknown>
      );

    andConditions.push(condition);
  }

  if (andConditions.length === 0) {
    return {} as TWhereInput;
  }

  return { AND: andConditions } as unknown as TWhereInput;
}
