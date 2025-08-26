type Primitive = string | number | boolean | Date;
interface BuildDataOptions {
  [key: string]:
    | Primitive
    | Primitive[]
    | BuildDataOptions
    | BuildDataOptions[]
    | undefined;
}
/**
 * Cria um objeto adaptativo para Prisma create/update/upsert.
 * @param data Dados recebidos do frontend (plain object)
 * @param nestedRelations Lista de campos que são relações e devem ser tratados como nested
 * @returns Objeto pronto para Prisma
 */
export function buildPrismaData<T extends BuildDataOptions>(
  data: T,
  nestedRelations: string[] = []
): any {
  const result: Record<string, any> = {};

  for (const key in data) {
    const value = data[key];

    if (value === undefined || value === null) continue;

    // Campos que são relações
    if (nestedRelations.includes(key)) {
      if (Array.isArray(value)) {
        result[key] = {
          create: value.map((v) => buildPrismaData(v as any)), // nested array
        };
      } else if (typeof value === "object") {
        result[key] = { create: buildPrismaData(value as any) }; // nested object
      }
    } else {
      // Campos simples
      result[key] = value;
    }
  }

  return result;
}
