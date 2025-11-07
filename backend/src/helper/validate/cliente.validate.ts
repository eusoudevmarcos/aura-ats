import prisma from "../../lib/prisma";

export const validateBasicFieldsCliente = async (data: any): Promise<void> => {
  if (!data.empresa && !data.empresaId) {
    throw new Error(
      "Dados da empresa (ID ou objeto) são obrigatórios para um cliente."
    );
  }

  if (
    !data?.empresa?.representantes &&
    data.empresa.representantes.length === 0
  ) {
    throw new Error(
      "Ao criar uma nova empresa, é obrigatório informar pelo menos um representante."
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
    const empresaExistentePorCnpj = await prisma.empresa.findUnique({
      where: { cnpj: data.empresa.cnpj },
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
