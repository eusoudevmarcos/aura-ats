type NestedData = Record<string, any>;

export type BuildPolicy = {
  /** Profundidade máxima de recursão */
  maxDepth?: number;

  /** Chaves completamente ignoradas */
  ignoreKeys?: string[];

  /** Chaves tratadas como JSON opaco (não recursivo) */
  jsonKeys?: string[];

  /** Limite de itens por array, por chave */
  maxArrayLengthByKey?: Record<string, number>;

  /**
   * Decide dinamicamente se deve percorrer um nó
   * Retornar false impede o build daquele ramo
   */
  shouldTraverse?: (params: {
    key: string;
    value: any;
    depth: number;
    parentOperation: "create" | "update";
  }) => boolean;
};

export class BuildNestedOperation {
  private policy: Required<BuildPolicy>;

  constructor(policy?: BuildPolicy, private debug = false) {
    this.policy = {
      maxDepth: policy?.maxDepth ?? 20,
      ignoreKeys: policy?.ignoreKeys ?? [],
      jsonKeys: policy?.jsonKeys ?? [],
      maxArrayLengthByKey: policy?.maxArrayLengthByKey ?? {},
      shouldTraverse: policy?.shouldTraverse ?? (() => true),
    };
  }

  public build(
    entityData: NestedData | NestedData[] | undefined,
    _opts?: { _depth?: number; _seen?: WeakSet<object> },
    parentOperation: "create" | "update" = "create"
  ): any {
    const depth = _opts?._depth ?? 0;
    const seen = _opts?._seen ?? new WeakSet<object>();

    if (!entityData) return undefined;

    if (depth > this.policy.maxDepth) {
      throw new Error(
        `BuildNestedOperation: maxDepth ${this.policy.maxDepth} excedido`
      );
    }

    /* ============================
       ARRAYS
    ============================ */
    if (Array.isArray(entityData)) {
      if (entityData.length === 0) {
        return parentOperation === "update" ? { deleteMany: {} } : undefined;
      }

      // Array de primitivos
      if (this.isArrayOfPrimitives(entityData)) {
        return entityData;
      }

      const create: any[] = [];
      const update: any[] = [];
      const connect: any[] = [];

      for (const item of entityData) {
        if (!item || typeof item !== "object") continue;

        if (item.id) {
          const hasOtherFields = Object.keys(item).some(
            (k) => k !== "id" && item[k] !== undefined
          );

          if (hasOtherFields) {
            update.push({
              where: { id: item.id },
              data: this.processEntityData(item, depth + 1, seen, "update"),
            });
          } else {
            connect.push({ id: item.id });
          }
        } else {
          create.push(this.processEntityData(item, depth + 1, seen, "create"));
        }
      }

      const result: any = {};
      if (create.length) result.create = create;
      if (update.length) result.update = update;
      if (connect.length) result.connect = connect;

      return Object.keys(result).length ? result : undefined;
    }

    /* ============================
       OBJECT
    ============================ */
    if (typeof entityData === "object") {
      if (seen.has(entityData)) {
        throw new Error("BuildNestedOperation: referência cíclica detectada");
      }
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
        }

        return { connect: { id: entityData.id } };
      }

      return {
        create: this.processEntityData(entityData, depth + 1, seen, "create"),
      };
    }

    throw new Error(`BuildNestedOperation: tipo inválido em depth=${depth}`);
  }

  /* ============================
     PROCESS ENTITY DATA
  ============================ */
  private processEntityData(
    obj: NestedData,
    depth: number,
    seen: WeakSet<object>,
    parentOperation: "create" | "update"
  ): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (value === undefined) continue;

      // 1️⃣ Ignorar chave
      if (this.policy.ignoreKeys.includes(key)) continue;

      // 2️⃣ JSON opaco
      if (this.policy.jsonKeys.includes(key)) {
        result[key] = value;
        continue;
      }

      // 3️⃣ Callback de decisão
      if (
        !this.policy.shouldTraverse({
          key,
          value,
          depth,
          parentOperation,
        })
      ) {
        if (this.debug) {
          console.warn(`Traversal bloqueado em "${key}"`);
        }
        continue;
      }

      // 4️⃣ Date
      if (value instanceof Date) {
        result[key] = value;
        continue;
      }

      // 4️⃣ Primitivos
      if (this.isPrimitive(value)) {
        result[key] = value;
        continue;
      }

      // 5️⃣ Array de primitivos
      if (Array.isArray(value) && this.isArrayOfPrimitives(value)) {
        result[key] = value;
        continue;
      }

      // 6️⃣ Limite de array por chave
      if (Array.isArray(value)) {
        const max = this.policy.maxArrayLengthByKey[key];
        if (max !== undefined && value.length > max) {
          throw new Error(`Array "${key}" excede o limite de ${max} itens`);
        }
      }

      // 7️⃣ Recursão
      const nested = this.build(
        value,
        { _depth: depth, _seen: seen },
        parentOperation
      );

      if (nested !== undefined) {
        result[key] = nested;
      }
    }

    return result;
  }

  /* ============================
     HELPERS
  ============================ */
  private isPrimitive(v: any) {
    return (
      v === null ||
      v instanceof Date ||
      ["string", "number", "boolean"].includes(typeof v)
    );
  }

  private isArrayOfPrimitives(arr: any[]): boolean {
    return arr.length > 0 && arr.every((item) => this.isPrimitive(item));
  }
}
