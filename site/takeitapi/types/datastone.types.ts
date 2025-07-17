// Interface para o resultado da busca em lista
export interface EntitySearchResult {
  document: string;
  name: string;
  // Adicione outros campos que a busca de lista retorna
}

// Interface para os parâmetros da função de busca
export interface SearchParams {
  query: string;
  type: 'pf' | 'pj';
  uf?: string;
}

// Interface para os detalhes completos (pode ser expandida)
export interface EntityDetails {
  [key: string]: any; // Permite qualquer estrutura, pois não sabemos todos os campos
}