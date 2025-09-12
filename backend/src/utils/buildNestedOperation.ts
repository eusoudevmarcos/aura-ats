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
  // Você pode ajustar maxDepth conforme necessidade (proteção contra recursão infinita)
  constructor(private maxDepth = 20) {}

  protected buildNestedOperation(
    entityData: NestedData | NestedData[] | undefined,
    _opts?: { _depth?: number; _seen?: WeakSet<object> }
  ): any {
    const depth = _opts?._depth ?? 0;
    const seen = _opts?._seen ?? new WeakSet<object>();

    if (entityData === undefined || entityData === null) return undefined;
    if (depth > this.maxDepth) {
      throw new Error(
        `buildNestedOperation: max depth ${this.maxDepth} exceeded`
      );
    }

    // Arrays de primitivos -> retorna o array bruto (ex.: enum[] ou string[]).
    if (Array.isArray(entityData) && this.isArrayOfPrimitives(entityData)) {
      return entityData;
    }

    // Array de objetos -> gerar create/update/connect
    if (Array.isArray(entityData)) {
      const create: any[] = [];
      const update: any[] = [];
      const connect: any[] = [];

      for (const item of entityData) {
        if (!item || typeof item !== "object") {
          // fallback: empurra primitivo como create
          create.push(item);
          continue;
        }

        if (item.id) {
          const hasOtherFields = Object.keys(item).some(
            (k) => k !== "id" && item[k] !== undefined
          );

          if (hasOtherFields) {
            const id = item.id;
            // processa recursivamente os campos de update (sem o id)
            const updateData = this.processEntityData(
              this.stripId(item),
              depth + 1,
              seen
            );
            update.push({
              where: { id },
              data: updateData,
            });
          } else {
            connect.push({ id: item.id });
          }
        } else {
          // sem id => create (processado recursivamente)
          const createData = this.processEntityData(item, depth + 1, seen);
          create.push(createData);
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
      // Protege contra ciclos por referência
      if (seen.has(entityData)) {
        throw new Error(
          "buildNestedOperation: detected cyclic reference in input"
        );
      }
      seen.add(entityData);

      if (entityData.id) {
        // existe id -> decide entre update (se tem outros campos) ou connect
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
          return {
            update: {
              where: { id },
              data: updateData,
            },
          };
        } else {
          return { connect: { id: entityData.id } };
        }
      } else {
        // sem id -> create (processa campos recursivamente)
        const createData = this.processEntityData(entityData, depth + 1, seen);
        return { create: createData };
      }
    }

    return undefined;
  }

  /**
   * Monta o objeto "data" que será usado em update/create:
   * - campos primitivos são mantidos
   * - campos objeto/array são processados recursivamente com buildNestedOperation
   */
  private processEntityData(
    obj: NestedData,
    depth: number,
    seen: WeakSet<object>
  ): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key of Object.keys(obj)) {
      const value = obj[key];

      if (value === undefined) continue;

      // primitivos e Date
      if (this.isPrimitive(value)) {
        result[key] = value;
        continue;
      }

      // array de primitivos -> manter array (ou você pode optar por { set: [...] } se preferir)
      if (Array.isArray(value) && this.isArrayOfPrimitives(value)) {
        result[key] = value;
        continue;
      }

      // objetos/arrays -> processa recursivamente
      if (Array.isArray(value) || typeof value === "object") {
        const nested = this.buildNestedOperation(value, {
          _depth: depth,
          _seen: seen,
        });
        if (nested !== undefined) {
          result[key] = nested;
        }
        continue;
      }

      // fallback
      result[key] = value;
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
