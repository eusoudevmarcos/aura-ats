import { z } from "zod";
import { pessoaSchema } from "./pessoa.schema";
import { empresaSchema } from "./empresa.schema";

export const funcionarioSchema = z.object({
  tipoUsuario: z.enum([
    "ADMIN",
    "MODERADOR",
    "ATENDENTE",
    "PROFISSIONAL",
    "FUNCIONARIO",
  ]),
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  setor: z.string().optional(),
  cargo: z.string().optional(),

  tipoPessoaOuEmpresa: z.enum(["pessoa", "empresa"]),

  pessoa: pessoaSchema.optional(),
  empresa: empresaSchema.optional(),
});
