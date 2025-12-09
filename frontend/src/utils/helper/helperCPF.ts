import { unmask } from '@/utils/mask/unmask';

type DocumentoTipo = 'cpf' | 'cnpj';

/**
 * Adiciona zero(s) à esquerda para CPF (11 dígitos) ou CNPJ (14 dígitos).
 * Se faltar apenas 1 dígito, adiciona 1 zero à esquerda.
 * Usa unmask para remover máscara antes de processar.
 * Caso tipo não seja especificado, tenta auto-detectar.
 *
 * @param valor string ou número (CPF ou CNPJ, mascarado ou não)
 * @param tipo 'cpf' | 'cnpj' | undefined
 * @returns string processada
 */
export const handleZeroLeft = (
  valor: string | number,
  tipo?: DocumentoTipo
): string => {
  let num = valor?.toString?.() ?? '';
  num = unmask(num);

  // Se tipo não informado, tenta auto-detectar: 10/11 digitos -> cpf, 13/14 digitos -> cnpj
  let docTipo: DocumentoTipo | undefined = tipo;
  if (!docTipo) {
    if (num.length <= 11) docTipo = 'cpf';
    else docTipo = 'cnpj';
  }

  // Realiza padding se faltar só 1 digito (como explicitado no prompt)
  if (docTipo === 'cpf') {
    if (num.length === 10) {
      num = num.padStart(11, '0');
    }
    // Se length < 10, também completa até 11
    else if (num.length < 11) {
      num = num.padStart(11, '0');
    }
    // Se length == 11, está ok, retorna
    // Se length > 11, retorna como está, para evitar encaixar cnpj por engano
  } else if (docTipo === 'cnpj') {
    if (num.length === 13) {
      num = num.padStart(14, '0');
    } else if (num.length < 13) {
      num = num.padStart(14, '0');
    }
    // Se length == 14, está ok, retorna
  }

  return num;
};
