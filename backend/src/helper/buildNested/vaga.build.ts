import { BuildNestedOperation } from "./buildNestedOperation";

export const buildVagaData = async (data: any): Promise<any> => {
  let vagaData: any = {
    titulo: data.titulo,
    responsabilidades: data.responsabilidades,
    status: data.status,
    tipoSalario: data.tipoSalario,
    categoria: data.categoria,
    descricao: data.descricao,
  };

  // Adicionar outros campos simples do rest
  // Removido "id = undefined" pois pode não existir a variável
  const {
    titulo,
    beneficios,
    habilidades,
    anexos,
    localizacao,
    localizacaoId,
    clienteId,
    cliente,
    update_at,
    triagens,
    ...rest
  } = data;

  if (rest.id) {
    delete rest.id;
  }

  const buildNestedOperation = new BuildNestedOperation({
    jsonKeys: ["dadosAnteriores", "dadosNovos", "metadata"],
    ignoreKeys: ["__typename", "_internal"],
    maxArrayLengthByKey: {
      habilidades: 50,
      beneficios: 20,
    },
    shouldTraverse: ({ depth }) => depth <= 6,
  });

  if (data.clienteId) {
    const cliente = { id: data.clienteId };
    vagaData.cliente = buildNestedOperation.build(cliente);
  }

  if (data.localizacao) {
    vagaData.localizacao = buildNestedOperation.build(data.localizacao);
  }

  if (Array.isArray(data.historico) && data.historico.length > 0) {
    vagaData.historico = buildNestedOperation.build(data.historico);
  }

  // if (Array.isArray(triagens) && triagens.length) {
  //   // remover duplicados por tipoTriagem
  //   const uniqueByTipo = Array.from(
  //     new Map(
  //       triagens
  //         .filter((t: any) => !!t && !!t.tipoTriagem)
  //         .slice(0, 4)
  //         .map((t: any) => [t.tipoTriagem, t])
  //     ).values()
  //   );

  //   vagaData.triagens = buildNestedOperation.build(
  //     uniqueByTipo.map((t: any) => ({
  //       tipoTriagem: t.tipoTriagem,
  //       ativa: t.ativa ?? true,
  //     }))
  //   );
  // }

  return vagaData;
};
