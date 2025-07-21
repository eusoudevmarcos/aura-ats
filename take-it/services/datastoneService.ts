import axios, { AxiosInstance } from 'axios';
import { EntitySearchResult, EntityDetails, SearchParams } from '../types/datastone.types';

// Configuração central do Axios para interagir com a Datastone API
const datastoneApi: AxiosInstance = axios.create({
    baseURL: process.env.DATASTONE_API_URL,
    headers: {
        'Authorization': process.env.DATASTONE_API_KEY
    }
});

/**
 * Busca uma lista de entidades (PF ou PJ).
 */
export const searchEntity = async ({ query, type, uf }: SearchParams): Promise<EntitySearchResult[]> => {
    console.log(`Buscando por: ${query} (Tipo: ${type}, UF: ${uf})`);

    try {
        const endpoint = type === 'pf' ? '/v1/persons/search/' : '/v1/companies/search/';
        const params = { name: query, uf: uf || '' };

        const response = await datastoneApi.get(endpoint, { params });
        
        // A API retorna um objeto com uma chave 'data', que contém a lista
        return response.data.data || [];

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erro ao buscar na API Datastone:', error.response?.data);
        } else {
            console.error('Erro inesperado:', error);
        }
        return [];
    }
};

/**
 * Busca os detalhes completos de uma entidade (PF ou PJ).
 */
export const getEntityDetails = async (document: string, type: 'pf' | 'pj'): Promise<EntityDetails | null> => {
    console.log(`Buscando detalhes para o documento: ${document}`);
    
    const cleanDocument = document.replace(/[^\d]/g, '');

    try {
        let endpoint: string;
        let params: { cpf?: string; cnpj?: string; } = {};

        if (type === 'pf') {
            endpoint = '/v1/persons/';
            params.cpf = cleanDocument;
        } else {
            endpoint = '/v1/companies/';
            params.cnpj = cleanDocument;
        }

        const response = await datastoneApi.get<EntityDetails>(endpoint, { params });
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erro ao buscar detalhes na API Datastone:', error.response?.data);
        } else {
            console.error('Erro inesperado:', error);
        }
        return null;
    }
};