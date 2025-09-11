function filtrarValores(obj: any): any {
  if (Array.isArray(obj)) {
    const filtrado = obj
      .map((item) => filtrarValores(item))
      .filter((item) => item !== undefined);
    return filtrado.length > 0 ? filtrado : undefined;
  }
  // CORREÇÃO: Verificar se é Date antes de verificar se é object
  else if (obj instanceof Date) {
    return obj; // Retorna a Date sem processar
  } else if (obj !== null && typeof obj === "object") {
    const novoObj: any = {};
    Object.keys(obj).forEach((key) => {
      const valorFiltrado = filtrarValores(obj[key]);
      if (valorFiltrado !== null && valorFiltrado !== undefined) {
        novoObj[key] = valorFiltrado;
      }
    });
    // Só retorna o objeto se tiver pelo menos uma chave
    return Object.keys(novoObj).length > 0 ? novoObj : undefined;
  } else if (obj !== null && obj !== undefined) {
    return obj;
  }
  return undefined;
}

export default function usuarioSistemaDTO(usuarioSistema: any) {
  const resultado = filtrarValores(usuarioSistema);
  return resultado || {};
}
