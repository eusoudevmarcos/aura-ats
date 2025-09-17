import bcrypt from "bcryptjs";
import { BuildNestedOperation } from "./buildNestedOperation";

export const buildUsuarioData = async (data: any): Promise<any> => {
  console.log("aqui");
  const usuarioData: any = {
    email: data.email,
    tipoUsuario: data.tipoUsuario,
    password: await bcrypt.hash(data.password, 10),
  };

  if (data.password) {
    usuarioData.password = await bcrypt.hash(data.password, 10);
  }

  const buildNestedOperation = new BuildNestedOperation();

  if (data.pessoa) {
    usuarioData.pessoa = buildNestedOperation.build(data.pessoa);

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
  if (data.empresa) {
    usuarioData.empresa = buildNestedOperation.build(data.empresa);

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

  // Funcionário (sempre opcional)
  if (data.funcionario) {
    usuarioData.funcionario = buildNestedOperation.build(data.funcionario);
  }

  return usuarioData;
};
