/**
 * Cria dinamicamente um objeto `where` para qualquer entidade Prisma.
 *
 * @param search - termo de busca
 * @param fields - lista de campos a pesquisar (pode incluir campos aninhados ex: "localizacao.cidade")
 * @returns objeto tipado para ser usado em qualquer findMany / count
 */
export function buildWhere<TWhereInput extends Record<string, any>>(
  search: string,
  fields: string[]
): TWhereInput {
  if (!search || !search.trim() || fields.length === 0) {
    return {} as TWhereInput;
  }

  const orConditions = fields.map((field) => {
    const parts = field.split(".");

    if (parts.length === 1) {
      // campo simples
      return {
        [parts[0]]: { contains: search, mode: "insensitive" },
      };
    } else {
      // campo aninhado
      return parts.reverse().reduce((acc, key, idx) => {
        if (idx === 0) {
          return { [key]: { contains: search, mode: "insensitive" } };
        }
        return { [key]: acc };
      }, {});
    }
  });

  return { OR: orConditions } as unknown as TWhereInput;
}
