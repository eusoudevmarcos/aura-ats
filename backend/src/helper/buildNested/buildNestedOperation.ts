type NestedData = Record<string, any>;

/**
 * Helper para gerar os inputs nested que o Prisma espera:
 * - arrays de objetos => { create?, update?, connect? }
 * - objeto com id + outros campos => { update: { where:{id}, data: {...} } }
 * - objeto com id apenas => { connect: { id } }
 * - objeto sem id => { create: {...} }
 *
 * Trata recursivamente campos aninhados (arrays/objetos) até maxDepth.
 */
export class BuildNestedOperation {
  constructor(private maxDepth = 20, private debug = false) {}

  public build(
    entityData: NestedData | NestedData[] | undefined,
    _opts?: { _depth?: number; _seen?: WeakSet<object> },
    parentOperation: "create" | "update" = "create"
  ): any {
    const depth = _opts?._depth ?? 0;
    const seen = _opts?._seen ?? new WeakSet<object>();

    if (!entityData) return undefined;
    if (depth > this.maxDepth)
      throw new Error(
        `buildNestedOperation: max depth ${this.maxDepth} excedido`
      );

    // Arrays de primitivos
    if (Array.isArray(entityData) && this.isArrayOfPrimitives(entityData))
      return entityData;

    // Array de objetos
    if (Array.isArray(entityData)) {
      const create: any[] = [];
      const update: any[] = [];
      const connect: any[] = [];

      for (const item of entityData) {
        if (!item || typeof item !== "object")
          throw new Error(
            `buildNestedOperation: item inválido no array em depth=${depth}`
          );

        if (item.id) {
          const hasOtherFields = Object.keys(item).some(
            (k) => k !== "id" && item[k] !== undefined
          );
          if (hasOtherFields) {
            update.push({
              where: { id: item.id },
              data: this.processEntityData(item, depth + 1, seen),
            });
          } else {
            connect.push({ id: item.id });
          }
        } else {
          create.push(this.processEntityData(item, depth + 1, seen));
        }
      }

      const result: any = {};
      if (create.length) result.create = create;
      if (update.length) result.update = update;
      if (connect.length) result.connect = connect;
      return Object.keys(result).length ? result : undefined;
    }

    // Objeto simples
    if (typeof entityData === "object") {
      if (seen.has(entityData))
        throw new Error("buildNestedOperation: referência cíclica detectada");
      seen.add(entityData);

      if (entityData.id) {
        const hasOtherFields = Object.keys(entityData).some(
          (k) => k !== "id" && entityData[k] !== undefined
        );
        if (hasOtherFields) {
          return {
            update: {
              where: { id: entityData.id },
              data: this.processEntityData(
                entityData,
                depth + 1,
                seen,
                "update"
              ),
            },
          };
        } else {
          return { connect: { id: entityData.id } };
        }
      } else {
        return {
          create: this.processEntityData(entityData, depth + 1, seen, "create"),
        };
      }
    }

    throw new Error(
      `buildNestedOperation: padrão de dados inválido em depth=${depth}`
    );
  }

  private processEntityData(
    obj: NestedData,
    depth: number,
    seen: WeakSet<object>,
    parentOperation: "create" | "update" = "create"
  ): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (value === undefined) continue;

      if (this.isPrimitive(value)) {
        result[key] = value;
        continue;
      }

      if (Array.isArray(value) && this.isArrayOfPrimitives(value)) {
        result[key] = value;
        continue;
      }

      if (Array.isArray(value) || typeof value === "object") {
        const nested = this.build(
          value,
          { _depth: depth, _seen: seen },
          parentOperation
        );
        if (!nested) continue;

        // Se nested já é { create/update/connect }, mantém
        if (nested.create || nested.update || nested.connect) {
          result[key] = nested;
        } else {
          // Para objetos simples dentro de create/update
          result[key] = nested;
        }
        continue;
      }

      throw new Error(
        `processEntityData: valor inválido detectado na chave "${key}" em depth=${depth}`
      );
    }

    return result;
  }

  private isPrimitive(v: any) {
    return (
      v === null ||
      ["string", "number", "boolean"].includes(typeof v) ||
      v instanceof Date
    );
  }

  private isArrayOfPrimitives(arr: any[]): boolean {
    return arr.length === 0 || arr.every((item) => this.isPrimitive(item));
  }
}
