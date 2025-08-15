import { ContatoInput } from "@/schemas/contato.schema";
import { LocalizacaoInput } from "@/schemas/localizacao.schema";

export type Empresa = {
  id: string;
  razaoSocial: string;
  cnpj: string;
  dataAbertura: string;
  localizacoes: LocalizacaoInput;
  contatos: ContatoInput[];
};
