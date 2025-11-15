export const handleZeroLeft = (cpf: string | number): string => {
  cpf = cpf.toString();

  if (typeof cpf == 'string') {
    cpf = cpf.replace(/\D/g, '');
  }

  //Adiciona zero a esquerda
  if (cpf.length < 11) {
    cpf = cpf.padStart(11, '0');
  }

  return cpf;
};
