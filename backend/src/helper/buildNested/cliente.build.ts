import { StatusCliente } from "@prisma/client";
import { generateRandomPassword } from "../../utils/generateRandomPassword";
import { BuildNestedOperation } from "./buildNestedOperation";

export const buildClienteData = async (data: any): Promise<any> => {
  const { email, id, dataAssinatura, ...rest } = data;
  const clienteData: any = {
    status: rest.status as StatusCliente,
  };

  const buildNestedOperation = new BuildNestedOperation();

  if (data.empresa) {
    clienteData.empresa = buildNestedOperation.build(data.empresa);
  }

  if (email) {
    const usuarioSistemaData = {
      email: email,
      tipoUsuario: "CLIENTE",
      password:
        clienteData.password ||
        `${clienteData.empresa.nomeFantasia?.split(" ")[0]}${123}` ||
        generateRandomPassword(),
    };

    clienteData.usuarioSistema = buildNestedOperation.build(usuarioSistemaData);
  }

  if (data.planos && Array.isArray(data.planos)) {
    data.planos = data.planos.map((planoAssinado: any) => {
      const { planoId, ...rest } = planoAssinado;
      return {
        ...rest,
        plano: {
          id: planoId,
        },
      };
    });

    clienteData.planos = buildNestedOperation.build(data.planos);
  }

  return clienteData;
};
