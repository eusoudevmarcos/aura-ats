import bcrypt from "bcryptjs";
import { BuildNestedOperation } from "./buildNestedOperation";

export const buildUsuarioSistema = async (data: any): Promise<any> => {
  const usuarioData: any = {
    id: data?.id,
    email: data.email,
    tipoUsuario: data.tipoUsuario,
    password: data.password || (await bcrypt.hash(data.password, 10)),
  };

  if (data.tipoPessoaOuEmpresa) delete data.tipoPessoaOuEmpresa;

  const buildNestedOperation = new BuildNestedOperation();

  if (data?.funcionario && Object.keys(data?.funcionario).length > 0) {
    usuarioData.funcionario = buildNestedOperation.build(data?.funcionario);
    // if (data.pessoa.contatos) {
    //   usuarioData.pessoa.contatos = this.buildNestedOperation(
    //     data.pessoa.contatos
    //   );
    // }
    // if (data.pessoa.localizacoes) {
    //   usuarioData.pessoa.localizacoes = this.buildNestedOperation(
    //     data.pessoa.localizacoes
    //   );
    // }
  }
  if (data?.cliente && Object.keys(data?.cliente).length > 0) {
    usuarioData.cliente = buildNestedOperation.build(data.cliente);

    // if (data.empresa.contatos) {
    //   usuarioData.empresa.contatos = this.buildNestedOperation(
    //     data.empresa.contatos
    //   );
    // }
    // if (data.empresa.localizacoes) {
    //   usuarioData.empresa.localizacoes = this.buildNestedOperation(
    //     data.empresa.localizacoes
    //   );
    // }
  }

  return usuarioData;
};
