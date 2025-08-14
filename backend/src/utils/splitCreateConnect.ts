export const splitCreateConnect = <T extends { id?: string }>(
  items?: T[]
): { create?: Omit<T, "id">[]; connect?: { id: string }[] } | undefined => {
  if (!items?.length) return undefined;

  const create = items.filter((item) => !item.id) as Omit<T, "id">[];

  const connect = items
    .filter((item): item is T & { id: string } => typeof item.id === "string")
    .map((item) => ({ id: item.id }));

  const result: { create?: Omit<T, "id">[]; connect?: { id: string }[] } = {};
  if (create.length) result.create = create;
  if (connect.length) result.connect = connect;

  return Object.keys(result).length ? result : undefined;
};
