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
    _opts?: { _depth?: number; _seen?: WeakSet<object> }
  ): any {
    const depth = _opts?._depth ?? 0;
    const seen = _opts?._seen ?? new WeakSet<object>();

    if (entityData === undefined || entityData === null) {
      if (this.debug)
        console.debug(
          `[BuildNested] depth=${depth}: valor undefined/null ignorado`
        );
      return undefined;
    }

    if (depth > this.maxDepth) {
      throw new Error(
        `buildNestedOperation: max depth ${this.maxDepth} excedido`
      );
    }

    // Arrays de primitivos -> retorna o array bruto (ex.: enum[] ou string[]).
    if (Array.isArray(entityData) && this.isArrayOfPrimitives(entityData)) {
      if (this.debug)
        console.debug(
          `[BuildNested] depth=${depth}: array de primitivos`,
          entityData
        );
      return entityData;
    }

    // Array de objetos -> gerar create/update/connect
    if (Array.isArray(entityData)) {
      const create: any[] = [];
      const update: any[] = [];
      const connect: any[] = [];

      for (const item of entityData) {
        if (!item || typeof item !== "object") {
          throw new Error(
            `buildNestedOperation: item inválido no array em depth=${depth}`
          );
        }

        if (item.id) {
          const hasOtherFields = Object.keys(item).some(
            (k) => k !== "id" && item[k] !== undefined
          );

          if (hasOtherFields) {
            const id = item.id;
            const updateData = this.processEntityData(
              this.stripId(item),
              depth + 1,
              seen
            );
            update.push({ where: { id }, data: updateData });
            if (this.debug)
              console.debug(`[BuildNested] depth=${depth}: update ->`, {
                id,
                updateData,
              });
          } else {
            connect.push({ id: item.id });
            if (this.debug)
              console.debug(`[BuildNested] depth=${depth}: connect ->`, {
                id: item.id,
              });
          }
        } else {
          const createData = this.processEntityData(item, depth + 1, seen);
          create.push(createData);
          if (this.debug)
            console.debug(
              `[BuildNested] depth=${depth}: create ->`,
              createData
            );
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
      if (seen.has(entityData)) {
        throw new Error("buildNestedOperation: referência cíclica detectada");
      }
      seen.add(entityData);

      if (entityData.id) {
        const hasOtherFields = Object.keys(entityData).some(
          (k) => k !== "id" && entityData[k] !== undefined
        );

        if (hasOtherFields) {
          const id = entityData.id;
          const updateData = this.processEntityData(
            this.stripId(entityData),
            depth + 1,
            seen
          );
          if (this.debug)
            console.debug(`[BuildNested] depth=${depth}: objeto update ->`, {
              id,
              updateData,
            });
          return { update: { where: { id }, data: updateData } };
        } else {
          if (this.debug)
            console.debug(`[BuildNested] depth=${depth}: objeto connect ->`, {
              id: entityData.id,
            });
          return { connect: { id: entityData.id } };
        }
      } else {
        const createData = this.processEntityData(entityData, depth + 1, seen);
        if (this.debug)
          console.debug(
            `[BuildNested] depth=${depth}: objeto create ->`,
            createData
          );
        return { create: createData };
      }
    }

    throw new Error(
      `buildNestedOperation: padrão de dados inválido em depth=${depth}`
    );
  }

  private processEntityData(
    obj: NestedData,
    depth: number,
    seen: WeakSet<object>
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
        const nested = this.build(value, { _depth: depth, _seen: seen });
        if (nested !== undefined) {
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
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean" ||
      v instanceof Date
    );
  }

  private isArrayOfPrimitives(arr: any[]): boolean {
    return arr.length === 0 || arr.every((item) => this.isPrimitive(item));
  }

  private stripId(obj: Record<string, any>) {
    const { id, ...rest } = obj;
    return rest;
  }
}
