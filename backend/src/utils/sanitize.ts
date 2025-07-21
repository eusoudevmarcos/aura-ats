export function sanitize(params: string) {
  let resultado: any = {};

  // Remove espaços extras
  const paramsTrim = params.trim();

  const cpfValido = validateCPF(paramsTrim);
  if (cpfValido) {
    resultado.cpf = cpfValido;
  }

  const phoneValido = validatePhone(paramsTrim);
  if (phoneValido) {
    resultado.phone = phoneValido;
  }

  const cepValido = validateCEP(paramsTrim);
  if (cepValido) {
    resultado.cep = cepValido;
  }

  const nameValido = isName(paramsTrim);
  if (nameValido) {
    resultado.name = isName(paramsTrim);
  }

  // Verifica se peo menos um dado é valido nas regras
  if (Object.keys(resultado).length > 0) {
    // Retorna apenas o primeiro campo válido encontrado
    const chave = Object.keys(resultado)[0];
    return {
      tipo: chave,
      dado: resultado[chave],
      url: `${chave}=${resultado[chave]}`,
    };
  } else {
    return {
      error: true,
      mensagem:
        "Erro ao consultar, verifique se é um CPF ou CEP ou Nome Completo ou Telefone valido",
    };
  }
}

const isName = (name: string) => {
  console.log(name.trim());
  const nameReplace = name.trim().replace(/\s+/g, " ");
  const regex = /^([A-Za-zÀ-ÿ]{2,})(\s[A-Za-zÀ-ÿ]{2,})+$/;
  return regex.test(nameReplace) ? nameReplace : null;
};

const validateCPF = (cpf: string) => {
  const cpfLimpo = cpf.replace(/\D/g, "");

  if (cpfLimpo.length !== 11) return null;

  if (!/^\d{11}$/.test(cpfLimpo)) {
    return null;
  }

  // Elimina CPFs inválidos conhecidos
  if (
    cpfLimpo === "00000000000" ||
    cpfLimpo === "11111111111" ||
    cpfLimpo === "22222222222" ||
    cpfLimpo === "33333333333" ||
    cpfLimpo === "44444444444" ||
    cpfLimpo === "55555555555" ||
    cpfLimpo === "66666666666" ||
    cpfLimpo === "77777777777" ||
    cpfLimpo === "88888888888" ||
    cpfLimpo === "99999999999"
  ) {
    return null;
  }

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) {
    return null;
  }

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) {
    return null;
  }

  return cpfLimpo;
};

const validatePhone = (cep: string) => {
  const telefoneLimpo = cep.replace(/[^\d]+/g, "");
  return !/^\d{10,11}$/.test(telefoneLimpo) ? null : telefoneLimpo;
};

const validateCEP = (cep: string) => {
  const cepLimpo = cep.replace(/[^\d]+/g, "");
  return !/^\d{8}$/.test(cepLimpo) ? null : cepLimpo;
};
