import { z } from "zod";
import { TipoUsuarioEnum } from "@/schemas/tipoUsuarioEnum.schame";
import { AreaProfissionalEnum } from "./areaProfissionalEnum.schama";
import { contatoSchema } from "./contato.schema";
import { localizacaoSchema } from "./localizacao.schema";
import { formacaoSchema } from "./formacao.schame";

export const funcionarioMiniSchema = z
  .object({
    setor: z.string().optional(),
    cargo: z.string().optional(),
  })
  .optional();

export const ProfissionalInputSchema = z.object({
  area: AreaProfissionalEnum,
  crm: z.string().optional(),
  corem: z.string().optional(),
  rqe: z.string().optional(),
  funcionario: funcionarioMiniSchema,
  especialidadeId: z.number().int().positive().optional(),
  contatos: contatoSchema,
  localizacao: localizacaoSchema,
  formacao: formacaoSchema,
});

export type ProfissionalInput = z.infer<typeof ProfissionalInputSchema>;
