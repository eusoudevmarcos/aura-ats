import axios from "axios";
import { unmask } from "../utils/mask/unmask";

/**
 * Consulta a API de busca.
 * @param {string} input Valor a ser pesquisado (CPF, CNPJ, nome, etc)
 * @param {string} typeColumns Tipo de busca: "persons" ou "companies"
 * @param {Object} options Parâmetros opcionais (uf, filial, list, isDetail, etc)
 * @returns {Promise<any>} Dados retornados pela API
 */
export async function searchApi(input, typeColumns, options = {}) {
  if (!input || input.trim() === "") {
    throw new Error("Por favor, preencha o campo de busca.");
  }

  const inputUnmask = unmask(input);

  const URL = "http://localhost:3001/api/search";

  const params = {
    query: inputUnmask,
    tipo: typeColumns,
    ...options,
  };

  try {
    const response = await axios.get(URL, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
}
