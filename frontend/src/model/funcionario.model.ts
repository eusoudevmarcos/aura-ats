import { ContatoInput, LocalizacaoInput } from "@/schemas/pessoa.schema";

export type Pessoa = {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  rg: string;
  estadoCivil: string;
  createdAt: string;
  updatedAt: string;
};

export type Empresa = {
  id: string;
  razaoSocial: string;
  cnpj: string;
  dataAbertura: string;
  localizacoes: LocalizacaoInput;
  contatos: ContatoInput[];
  // outros campos se necessário
};

export type Funcionario = {
  id: string;
  email: string;
  password: string;
  tipoUsuario: string;
  setor?: string;
  cargo?: string;
  pessoaId?: string;
  empresaId?: string | null;
  pessoa?: Pessoa | null;
  empresa?: Empresa | null;
};
