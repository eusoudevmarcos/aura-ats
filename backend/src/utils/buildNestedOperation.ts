type NestedData = Record<string, any>;

export class buildNestedOperation {
  protected buildNestedOperation(entityData: NestedData | NestedData[]): any {
    if (!entityData) return undefined;

    // Se for array, processa cada item individualmente
    if (Array.isArray(entityData)) {
      const create: any[] = [];
      const update: any[] = [];
      const connect: any[] = [];

      for (const item of entityData) {
        if (item.id) {
          // Se existe ID, decide entre update ou connect
          const hasOtherFields = Object.keys(item).some(
            (key) => key !== "id" && item[key] !== undefined
          );

          if (hasOtherFields) {
            const { id, ...updateData } = item;
            update.push({
              where: { id },
              data: updateData,
            });
          } else {
            connect.push({ id: item.id });
          }
        } else {
          // Sem ID = criar novo
          create.push(item);
        }
      }

      const result: any = {};
      if (create.length) result.create = create;
      if (update.length) result.update = update;
      if (connect.length) result.connect = connect;

      return Object.keys(result).length ? result : undefined;
    }

    // Se for objeto simples
    if (entityData.id) {
      const hasOtherFields = Object.keys(entityData).some(
        (key) => key !== "id" && entityData[key] !== undefined
      );

      if (hasOtherFields) {
        const { id, ...updateData } = entityData;
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
      return { create: entityData };
    }
  }

  private stripId(obj: Record<string, any>) {
    const { id, ...rest } = obj;
    return rest;
  }
  // protected buildNestedOperation(entityData: NestedData | NestedData[]): any {
  //   if (!entityData) return undefined;

  //   // Se for array, processa cada item individualmente
  //   if (Array.isArray(entityData)) {
  //     const create: any[] = [];
  //     const update: any[] = [];
  //     const connect: any[] = [];

  //     for (const item of entityData) {
  //       if (item.id) {
  //         // Se existe ID, decide entre update ou connect
  //         const hasOtherFields = Object.keys(item).some(
  //           (key) => key !== "id" && item[key] !== undefined
  //         );

  //         if (hasOtherFields) {
  //           update.push({
  //             where: { id: item.id },
  //             data: this.buildNestedOperation(this.stripId(item)),
  //           });
  //         } else {
  //           connect.push({ id: item.id });
  //         }
  //       } else {
  //         create.push(this.buildNestedOperation(item));
  //       }
  //     }

  //     const result: any = {};
  //     if (create.length) result.create = create;
  //     if (update.length) result.update = update;
  //     if (connect.length) result.connect = connect;

  //     return Object.keys(result).length ? result : undefined;
  //   }

  //   // Se for objeto, percorre cada chave
  //   const result: any = {};
  //   for (const key of Object.keys(entityData)) {
  //     const value = entityData[key];

  //     // Se for objeto ou array, processa recursivamente
  //     if (value && typeof value === "object") {
  //       const nested = this.buildNestedOperation(value);
  //       if (nested !== undefined) {
  //         result[key] = nested;
  //       }
  //     } else {
  //       result[key] = value;
  //     }
  //   }

  //   return result;
  // }
}
