import prisma from "../../lib/prisma";
import { unmask } from "../../utils/unmask";

export const validateBasicFieldsCliente = async (data: any): Promise<void> => {
  if (
    !data?.empresa?.representantes &&
    data.empresa.representantes.length === 0
  ) {
    throw new Error(
      "Ao criar uma nova empresa, é obrigatório informar pelo menos um representante."
    );
  }

  const representantes = data?.empresa?.representantes;

  if (
    !data?.empresa?.id &&
    !representantes[0]?.id &&
    representantes[0] &&
    representantes[0]?.cpf
  ) {
    // Esse cemario é um connect previnindo o update e create.
    const cpf = unmask(representantes.cpf);
    const pessoa = await prisma.pessoa.findUnique({
      where: { cpf: cpf },
    });

    if (pessoa && pessoa?.id)
      data.empresa.representantes[0] = { id: pessoa.id };
  }

  if (data.email) {
    const isEmail = await prisma.usuarioSistema.findUnique({
      where: { email: data.email },
    });

    if (isEmail) {
      throw new Error("E-mail já existe no sistema como Usuario do Sistema");
    }
  }

  if (!data.empresa && !data.empresaId) {
    throw new Error(
      "Dados da empresa (ID ou objeto) são obrigatórios para um cliente."
    );
  }

  if (!data.empresa.id && data.empresa?.cnpj) {
    const cnpj = unmask(data.empresa.cnpj);

    const empresaExistentePorCnpj = await prisma.empresa.findUnique({
      where: { cnpj: cnpj },
    });

    if (empresaExistentePorCnpj) {
      const clienteExistente = await prisma.cliente.findUnique({
        where: { empresaId: empresaExistentePorCnpj.id },
      });

      if (clienteExistente) {
        throw new Error(
          `Já existe um cliente para a empresa com CNPJ: ${data.empresa.cnpj}`
        );
      }
    }
  }
};
