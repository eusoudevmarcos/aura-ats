export function sanitize(params: string, type: string) {
  const resultado: any = {};

  // Remove espaços extras
  const paramsTrim = params.trim();

  // Validação de email
  const emailValido = validateEmail(paramsTrim);
  if (emailValido) {
    resultado.email = emailValido;
  }

  const cpfValido = validateCPF(paramsTrim);
  if (cpfValido) {
    resultado.cpf = cpfValido;
  }

  const cnpjValido = validateCNPJ(paramsTrim);
  if (cnpjValido) {
    resultado.cnpj = cnpjValido;
  }

  const phoneValido = validatePhone(paramsTrim);
  if (phoneValido) {
    resultado.phone = phoneValido;
  }

  const cepValido = validateCEP(paramsTrim);
  if (cepValido) {
    resultado.cep = cepValido;
  }

  if (type === "persons") {
    const nameValido = isName(paramsTrim);
    if (nameValido) {
      resultado.name = isName(paramsTrim);
    }
  } else {
    const nameValido = isName(paramsTrim);
    if (nameValido) {
      resultado.razao_social = isName(paramsTrim);
    }
  }

  // Verifica se pelo menos um dado é válido nas regras
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
        "Erro ao consultar, verifique se é um CPF, CNPJ, email, CEP, Nome Completo ou Telefone válido",
    };
  }
}

// Função para validar email
const validateEmail = (email: string): string | null => {
  // Regex simples para validação de email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? email : null;
};

const validateCNPJ = (cnpj: string): string | null => {
  const cnpjLimpo = cnpj.replace(/\D/g, "");

  if (cnpjLimpo.length !== 14) return null;
  // CNPJs inválidos com todos os dígitos iguais
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return null;
  console.log(cnpj);

  const calcDigito = (base: number[]) => {
    let soma = 0;
    let pos = base.length - 7;
    for (let i = 0; i < base.length; i++) {
      soma += base[i] * pos--;
      if (pos < 2) pos = 9;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const numeros = Array.from(cnpjLimpo.substring(0, 12)).map(Number);
  const digitos = Array.from(cnpjLimpo.substring(12)).map(Number);

  const primeiroDigito = calcDigito(numeros);
  if (primeiroDigito !== digitos[0]) return null;

  const segundoDigito = calcDigito([...numeros, primeiroDigito]);
  if (segundoDigito !== digitos[1]) return null;

  return cnpjLimpo;
};

const isName = (name: string) => {
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
