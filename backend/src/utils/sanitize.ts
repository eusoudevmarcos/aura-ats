import { unmask } from "./unmask";

export type SearchType =
  | "CPF"
  | "CNPJ"
  | "EMAIL"
  | "CEP"
  | "PHONE"
  | "NAME"
  | "RAZAO_SOCIAL";

/**
 * Mapeia o SearchType (tipo de dado de busca) para o nome exato
 * do parâmetro de consulta (query parameter) esperado pela API Datastone.
 */
const queryParamMap: Record<SearchType, string> = {
  CPF: "cpf",
  CNPJ: "cnpj",
  EMAIL: "email",
  CEP: "cep",
  NAME: "name", // Usado para busca em 'persons/search'
  PHONE: "telefone", // Assumindo 'telefone' como parâmetro, ajuste se for 'phone'
  RAZAO_SOCIAL: "razao_social",
};

/**
 * Sanitiza entradas e define o tipo de dado, rota e query para chamada na API Datastone.
 *
 * @param value O valor de busca (ex: "123.456.789-00").
 * @param tipo O tipo de entidade alvo ("persons" ou "companies").
 * @param typeData O tipo de dado a ser consultado (ex: "CPF", "CNPJ").
 * @param options Opções adicionais (filial, list, uf).
 * @returns Um objeto contendo os componentes da URL e metadados.
 */
export function sanitize(
  value: string,
  tipo: "persons" | "companies",
  typeData: SearchType,
  options?: { filial?: boolean; list?: boolean; uf?: string }
): {
  tipo: string;
  dado: string;
  query: string;
  pathname: string;
  isDetail: boolean;
} {
  const newvalue = unmask(value);

  // 1. Determina o parâmetro de query e a query string base
  const queryParam = queryParamMap[typeData];
  let query = `${queryParam}=${newvalue}`;

  let pathname = "";
  let isDetail = false;

  // 2. Define rotas e queries baseadas no tipo de entidade e dado
  if (tipo === "companies") {
    // Busca detalhada de filial
    if (options?.filial) {
      pathname = "company/search/filial/";
      // O CNPJ é o único SearchType relevante para esta rota
      // Se não for CNPJ, a query padrão será usada, mas o Datastone pode rejeitar.
    }
    // Busca de lista (list, busca por nome/email/cep)
    else if (
      options?.list ||
      typeData === "RAZAO_SOCIAL" ||
      typeData === "EMAIL" ||
      typeData === "CEP" // Adicionado CEP à busca de lista
    ) {
      pathname = "company/list";
    }
    // Busca detalhada (Implica busca por CNPJ ou CEP - se não for lista)
    else {
      pathname = "companies/";
      isDetail = true;
    }
  } else if (tipo === "persons") {
    // Busca de lista/search (NAME, EMAIL, PHONE, CEP)
    if (["NAME", "EMAIL", "PHONE", "CEP"].includes(typeData)) {
      // Adicionado CEP à busca
      pathname = "persons/search";
      if (options?.uf) {
        query += `&uf=${options.uf}`; // Adiciona UF, se fornecido
      }
    }
    // Busca detalhada (CPF - chave única)
    else {
      pathname = "persons/";
      isDetail = true;
    }
  }

  // 3. Retorno da URL e metadados
  return { tipo: typeData, dado: value, query, pathname, isDetail };
}
