import z from "zod";

export const AreaProfissionalEnum = z.enum(["MEDICINA", "ENFERMAGEM", "OUTRO"]);
export type AreaProfissional = z.infer<typeof AreaProfissionalEnum>;
