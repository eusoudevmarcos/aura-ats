import { BuildNestedOperation } from "./buildNestedOperation";

export const buildVagaData = async (data: any): Promise<any> => {
  const vagaData: any = {
    titulo: data.titulo,
    responsabilidades: data.responsabilidades,
    clienteId: data.clienteId,
  };

  // Adicionar outros campos simples do rest
  const {
    id,
    titulo,
    beneficios,
    habilidades,
    anexos,
    localizacao,
    localizacaoId,
    clienteId,
    responsabilidades,
    ...rest
  } = data;

  Object.assign(vagaData, rest);

  // Benefícios - usar buildNestedOperation
  const buildNestedOperation = new BuildNestedOperation();

  if (data.beneficios && data.beneficios.length > 0) {
    vagaData.beneficios = buildNestedOperation.build(data.beneficios);
  }

  // Habilidades - usar buildNestedOperation
  if (data.habilidades && data.habilidades.length > 0) {
    vagaData.habilidades = buildNestedOperation.build(data.habilidades);
  }

  // Anexos - usar buildNestedOperation
  if (data.anexos && data.anexos.length > 0) {
    vagaData.anexos = buildNestedOperation.build(data.anexos);
    }
    
      if (data.anexos && data.anexos.length > 0) {
        vagaData.anexos = buildNestedOperation.build(data.anexos);
      }

  return vagaData;

  // Localização - usar buildNestedOperation ou conectar
  //   if (data.localizacaoId && !data.localizacao) {
  //     vagaData.localizacao = {
  //       connect: { id: data.localizacaoId },
  //     };
  //   } else if (data.localizacao) {
  //     // Se localizacao existe por cidade/uf, conectar, senão criar
  //     if (data.localizacao.cidade && data.localizacao.uf) {
  //       const localizacaoExistente = await prisma.localizacao.findFirst({
  //         where: {
  //           cidade: data.localizacao.cidade,
  //           uf: data.localizacao.uf,
  //         },
  //       });

  //       if (localizacaoExistente) {
  //         data.localizacao.id = localizacaoExistente.id;
  //       }
  //     }

  //     vagaData.localizacao = this.buildNestedOperation(data.localizacao);
  //   }
};
