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
    ...rest
  } = data;

  if (rest.id) {
    delete rest.id;
  }

  Object.assign(vagaData, rest);

  const buildNestedOperation = new BuildNestedOperation();

  if (data.clienteId) {
    vagaData.cliente = buildNestedOperation.build(
      data.cliente?.id ?? data.clienteId
    );
  }

  if (data.localizacao) {
    vagaData.localizacao = buildNestedOperation.build(data.localizacao);
  }

  return vagaData;
};
