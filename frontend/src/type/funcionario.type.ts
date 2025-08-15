import { Pessoa } from "./pessoa.type";
import { Empresa } from "./empresa.type";

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
