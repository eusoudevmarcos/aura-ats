/**
 * Cria dinamicamente um objeto `where` para Prisma a partir de uma string de busca
 * e uma lista de campos. Para campos de texto faz `contains` insensitivo,
 * para campos de data faz filtro por dia, mês ou ano baseado na string.
 */
export function buildWhere<TWhereInput extends Record<string, any>>(
  search: string,
  fields: string[]
): TWhereInput {
  if (!search || !fields || fields.length === 0) return {} as TWhereInput;

  const orConditions: Record<string, unknown>[] = [];

  fields.forEach((fieldPath) => {
    const parts = fieldPath.split(".");

    let condition: Record<string, unknown>;

    // Tenta interpretar search como número (dia/mês/ano)
    const numeric = Number(search);
    if (!isNaN(numeric)) {
      // Datas: filtra por dia, mês ou ano
      condition = {
        OR: [
          {
            gte: new Date(numeric, 0, 1),
            lte: new Date(numeric, 11, 31, 23, 59, 59, 999),
          },
          {
            gte: new Date(2000, numeric - 1, 1),
            lte: new Date(2000, numeric - 1, 31, 23, 59, 59, 999),
          },
          {
            gte: new Date(2000, 0, numeric),
            lte: new Date(2000, 11, numeric, 23, 59, 59, 999),
          },
        ],
      };
    } else {
      // Texto: contains insensitivo
      condition = { contains: search, mode: "insensitive" };
    }

    // Cria objeto aninhado
    const nested = parts
      .reverse()
      .reduce((acc, key) => ({ [key]: acc }), condition);

    orConditions.push(nested);
  });

  if (orConditions.length === 0) return {} as TWhereInput;

  return { OR: orConditions } as unknown as TWhereInput;
}
