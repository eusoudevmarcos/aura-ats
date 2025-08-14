import { Localizacao } from "@prisma/client";
import { injectable } from "tsyringe";

export type LocalizacaoCreateOrConnect =
  | Omit<Localizacao, "id" | "pessoaId" | "empresaId">
  | { id: string };

@injectable()
export class LocalizacaoRepository {
  async get(localizacao: any) {
    return {
      localizacoes: localizacao ? { create: localizacao } : undefined,
    };
  }
}
