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

  if (data?.empresa?.representantes?.[0]) {
    const cpf = unmask(data.empresa.representantes[0].cpf);

    const isPessoa = await prisma.pessoa.findUnique({
      where: { cpf: cpf },
    });

    if (isPessoa) {
      throw new Error("CPF já existe no sistema como Pessoa");
    }
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

  // if (data.empresaId) {
  //   const empresaExistente = await prisma.empresa.findUnique({
  //     where: { id: data.empresaId },
  //   });

  //   if (!empresaExistente) {
  //     throw new Error(`Empresa com ID ${data.empresaId} não encontrada.`);
  //   }

  //   const clienteExistente = await prisma.cliente.findUnique({
  //     where: { empresaId: data.empresaId },
  //   });

  //   if (clienteExistente) {
  //     throw new Error(
  //       `Já existe um cliente associado à empresa com ID: ${data.empresaId}`
  //     );
  //   }
  // }

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
