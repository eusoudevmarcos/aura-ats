import { Contato } from "@prisma/client";
import { injectable } from "tsyringe";

export type ContatoCreateOrConnect =
  | Omit<Contato, "id" | "pessoaId" | "empresaId">
  | { id: string };

@injectable()
export class ContatoRepository {
  get(contatos?: Partial<Pick<Contato, "pessoaId" | "empresaId">>[]) {
    return { ...contatos };
  }
}
