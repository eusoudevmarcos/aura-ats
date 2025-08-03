// Função principal que sanitiza entradas e define o tipo de dado, rota e query para chamada na API Datastone
export function sanitize(
  params: string,
  tipo: "persons" | "companies",
  options?: { filial?: boolean; list?: boolean; uf?: string }
):
  | {
      tipo: string;
      dado: string;
      query: string;
      pathname: string;
      isDetail: boolean;
    }
  | { error: true; mensagem: string } {
  const resultado: Record<string, string> = {};
  const paramsTrim = params.trim();

  // Validação individual de tipos possíveis
  const cpfValido = validateCPF(paramsTrim);
  if (cpfValido) resultado.cpf = cpfValido;

  const emailValido = validateEmail(paramsTrim);
  if (emailValido) resultado.email = emailValido;

  const cnpjValido = validateCNPJ(paramsTrim);
  console.log(cnpjValido);
  if (cnpjValido) resultado.cnpj = cnpjValido;

  const phoneValido = validatePhone(paramsTrim);
  if (phoneValido) resultado.phone = phoneValido;

  const cepValido = validateCEP(paramsTrim);
  if (cepValido) resultado.cep = cepValido;

  const nameValido = isName(paramsTrim);
  if (nameValido) {
    if (tipo === "companies") resultado.razao_social = nameValido;
    else resultado.name = nameValido;
  }

  // Verifica se ao menos um tipo foi detectado
  if (Object.keys(resultado).length > 0) {
    const chave = Object.keys(resultado)[0];
    const dado = resultado[chave];
    let pathname = "";
    let query = `${chave}=${dado}`;
    let isDetail = false;

    // Gera rotas e queries baseadas no tipo de entidade e dado informado
    if (tipo === "companies") {
      if (options?.filial) {
        pathname = "company/search/filial/";
        query = `cnpj=${resultado["cnpj"] ?? dado}`;
      } else if (options?.list || resultado?.razao_social) {
        pathname = "company/list";
      } else {
        pathname = "companies/";
        isDetail = true;
      }
    } else if (tipo === "persons") {
      if (["name", "email", "phone"].includes(chave)) {
        pathname = "persons/search";
        if (options?.uf) query += `&uf=${options.uf}`;
      } else {
        pathname = "persons/";
        isDetail = true;
      }
    }

    return { tipo: chave, dado, query, pathname, isDetail };
  } else {
    // Nenhum tipo reconhecido
    return {
      error: true,
      mensagem:
        "Erro ao consultar, verifique se é um CPF, CNPJ, email, CEP, Nome Completo ou Telefone válido",
    };
  }
}

// Regex básica para validar e-mail
const validateEmail = (email: string): string | null =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;

// Verifica se a string possui estrutura de nome completo
const isName = (name: string): string | null =>
  /^([A-Za-zÀ-ÿ]{2,})(\s[A-Za-zÀ-ÿ]{2,})+$/.test(name.trim())
    ? name.trim().replace(/\s+/g, " ")
    : null;

// Valida CPF com cálculo de dígitos verificadores
const validateCPF = (cpf: string): string | null => {
  const c = cpf.replace(/\D/g, "");
  if (c.length !== 11 || /^([0-9])\1{10}$/.test(c)) return null;
  let s = 0;
  for (let i = 0; i < 9; i++) s += +c[i] * (10 - i);
  let r = (s * 10) % 11;
  if (r === 10) r = 0;
  if (r !== +c[9]) return null;
  s = 0;
  for (let i = 0; i < 10; i++) s += +c[i] * (11 - i);
  r = (s * 10) % 11;
  if (r === 10) r = 0;
  return r === +c[10] ? c : null;
};

// Valida CNPJ com cálculo de dígitos verificadores
const validateCNPJ = (cnpj: string): string | null => {
  const c = cnpj.replace(/\D/g, "");
  if (c.length !== 14 || /^([0-9])\1{13}$/.test(c)) return null;
  let t = 12,
    n = c.substring(0, t),
    d = c.substring(t),
    s = 0,
    p = t - 7;
  for (let i = t; i >= 1; i--)
    (s += +n.charAt(t - i) * p--), (p = p < 2 ? 9 : p);
  let r = s % 11 < 2 ? 0 : 11 - (s % 11);
  if (r !== +d.charAt(0)) return null;
  t++;
  n = c.substring(0, t);
  s = 0;
  p = t - 7;
  for (let i = t; i >= 1; i--)
    (s += +n.charAt(t - i) * p--), (p = p < 2 ? 9 : p);
  r = s % 11 < 2 ? 0 : 11 - (s % 11);
  return r === +d.charAt(1) ? c : null;
};

// Valida número de telefone (10 ou 11 dígitos)
const validatePhone = (val: string): string | null => {
  const cleaned = val.replace(/[^\d]/g, "");
  return /^\d{10,11}$/.test(cleaned) ? cleaned : null;
};

// Valida CEP (8 dígitos)
const validateCEP = (val: string): string | null => {
  const cleaned = val.replace(/[^\d]/g, "");
  return /^\d{8}$/.test(cleaned) ? cleaned : null;
};
