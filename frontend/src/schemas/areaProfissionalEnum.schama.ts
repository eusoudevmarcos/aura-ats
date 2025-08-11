import z from "zod";

export const AreaProfissionalEnum = z.enum(["MEDICINA", "ENFERMAGEM", "OUTRO"]);
export type AreaProfissionalEnumInput = z.infer<typeof AreaProfissionalEnum>;
