import { StatusCliente, TipoServico } from "@prisma/client";
import { BuildNestedOperation } from "./buildNestedOperation";

export const buildClienteData = async (data: any): Promise<any> => {
  const clienteData: any = {
    status: data.status as StatusCliente,
    tipoServico: data.tipoServico as TipoServico[],
  };

  const buildNestedOperation = new BuildNestedOperation();
  if (data.empresa) {
    // Usa o helper genérico
    clienteData.empresa = buildNestedOperation.build(data.empresa);

    // Nested de contatos
    // if (data.empresa.contatos) {
    //   clienteData.empresa.contatos = this.buildNestedOperation(
    //     data.empresa.contatos
    //   );
    // }

    // Nested de localizações
    // if (data.empresa.localizacoes) {
    //   clienteData.empresa.localizacoes = this.buildNestedOperation(
    //     data.empresa.localizacoes
    //   );
    // }
  }

  return clienteData;
};
