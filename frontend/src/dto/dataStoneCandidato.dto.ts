import { CandidatoInput } from '@/schemas/candidato.schema';

/**
 * Interface para os dados recebidos da API DataStone
 */
export interface DataStoneApiResponse {
  cpf: number;
  name: string;
  rg?: string | null;
  birthday?: string | null;
  age?: string;
  gender?: string;
  mother_name?: string;
  addresses?: DataStoneAddress[];
  emails?: DataStoneEmail[];
  mobile_phones?: DataStonePhone[];
  land_lines?: DataStonePhone[];
  related_companies?: DataStoneCompany[];
  [key: string]: any; // Para campos adicionais que não serão mapeados
}

interface DataStoneAddress {
  type?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  district?: string | null;
  postal_code?: string | null;
  priority?: number;
}

interface DataStoneEmail {
  email: string;
  priority?: number;
}

interface DataStonePhone {
  ddd: number;
  number: string;
  priority?: number;
  [key: string]: any;
}

interface DataStoneCompany {
  cnpj: number;
  trading_name?: string;
  company_name: string;
  registry_situation?: string;
  description?: string;
  ownership?: number;
}

export enum AreaCandidato {
  MEDICINA = 'MEDICINA',
  ENFERMAGEM = 'ENFERMAGEM',
  OUTRO = 'OUTRO',
}

export enum TipoSocio {
  REPRESENTANTE = 'REPRESENTANTE',
  SOCIO = 'SOCIO',
  ADMINISTRADOR = 'ADMINISTRADOR',
}

/**
 * DTO para criar Candidato com todas as relações aninhadas
 * Formato compatível com o Prisma e o candidatoBuild
 *
 * A estrutura segue exatamente as relações do banco de dados:
 * - Candidato -> Pessoa (1:1)
 * - Pessoa -> Localizacao[] (1:N)
 * - Pessoa -> Socio[] (1:N)
 * - Socio -> Empresa (N:1)
 */
export interface DataStoneCandidatoDTO {
  areaCandidato: AreaCandidato;
  emails: string[];
  contatos: string[];
  links: string[];
  pessoa: {
    nome: string;
    cpf: string | null;
    rg: string | null;
    dataNascimento: Date | null;
    localizacoes: Array<{
      cep: string | null;
      cidade: string | null;
      bairro: string | null;
      uf: string;
      estado: string | null;
      complemento: string | null;
      logradouro: string | null;
      descricao?: string | null;
    }>;
    socios?: Array<{
      tipoSocio: TipoSocio;
      empresa: {
        cnpj: string;
        razaoSocial: string;
        nomeFantasia: string;
        dataAbertura?: Date | null;
      };
    }>;
  };
}

/**
 * Converte o tipo de sócio da descrição da API para o enum TipoSocio
 */
function mapTipoSocio(description?: string): TipoSocio {
  if (!description) return TipoSocio.SOCIO;

  const descLower = description.toLowerCase();
  if (descLower.includes('administrador') || descLower.includes('admin')) {
    return TipoSocio.ADMINISTRADOR;
  }
  if (descLower.includes('representante') || descLower.includes('representa')) {
    return TipoSocio.REPRESENTANTE;
  }
  return TipoSocio.SOCIO;
}

/**
 * Formata telefone para string "DDDNUMERO"
 */
function formatPhone(ddd: number, number: string): string {
  // Remove caracteres não numéricos do número
  const cleanNumber = number.replace(/\D/g, '');
  return `${ddd}${cleanNumber}`;
}

/**
 * Converte data de string para Date
 */
function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Converte CPF de number para string formatada
 */
function formatCpf(cpf: number): string {
  const cpfStr = cpf.toString().padStart(11, '0');
  return cpfStr;
}

/**
 * Converte CNPJ de number para string formatada
 */
function formatCnpj(cnpj: number): string {
  const cnpjStr = cnpj.toString().padStart(14, '0');
  return cnpjStr;
}

/**
 * Converte o JSON da API DataStone para o formato do banco de dados
 *
 * @example
 * ```typescript
 * const apiData = {
 *   cpf: 7438969126,
 *   name: "FLAVIO LEONARDO MACHADO DE PADUA",
 *   addresses: [...],
 *   emails: [...],
 *   mobile_phones: [...],
 *   related_companies: [...]
 * };
 *
 * const dto = convertDataStoneToCandidatoDTO(apiData);
 * // Agora você pode usar o dto com candidatoBuild e salvar no banco
 * const candidatoData = candidatoBuild(dto);
 * ```
 *
 * @param dataStoneData Dados recebidos da API DataStone
 * @returns DTO formatado para criação de Candidato no Prisma com todas as relações aninhadas
 */
export function convertDataStoneToCandidatoDTO(
  dataStoneData: DataStoneApiResponse
): Partial<CandidatoInput> {
  // Mapeia endereços para localizações
  const localizacoes =
    dataStoneData.addresses
      ?.filter(addr => {
        // Filtra endereços inválidos (sem cidade ou sem informações básicas)
        return (
          addr.city || addr.postal_code || (addr.street && addr.neighborhood)
        );
      })
      .map(addr => ({
        cep: addr.postal_code || null,
        cidade: addr.city || '',
        bairro: addr.neighborhood || null,
        uf: addr.district || '', // Default para DF se não informado
        estado: addr.district || null,
        complemento: addr.complement || null,
        logradouro: addr.street || null,
        descricao: addr.type || null,
      })) || [];

  // Mapeia emails
  const emails =
    dataStoneData.emails
      ?.map(email => email.email)
      .filter(email => email && email.trim() !== '') || [];

  // Mapeia telefones móveis e fixos
  const contatos: string[] = [];

  // Adiciona telefones móveis
  dataStoneData.mobile_phones?.forEach(phone => {
    const formatted = formatPhone(phone.ddd, phone.number);
    if (formatted && formatted.length >= 10) {
      contatos.push(formatted);
    }
  });

  // Adiciona telefones fixos
  dataStoneData.land_lines?.forEach(phone => {
    const formatted = formatPhone(phone.ddd, phone.number);
    if (formatted && formatted.length >= 10) {
      contatos.push(formatted);
    }
  });

  // Mapeia empresas relacionadas (sócios)
  const socios =
    dataStoneData.related_companies
      ?.filter(company => company.cnpj && company.company_name)
      .map(company => ({
        tipoSocio: mapTipoSocio(company.description),
        empresa: {
          cnpj: formatCnpj(company.cnpj),
          razaoSocial: company.company_name,
          nomeFantasia: company.trading_name || '',
          dataAbertura: null, // API não fornece data de abertura
        },
      })) || [];

  // Corrigir dataNascimento para string ou null (ISO string ou vazio)
  let dataNascimento: string | null = null;
  if (dataStoneData.birthday) {
    dataNascimento = (() => {
      const [year, month, day] = dataStoneData.birthday.split('-');
      if (year && month && day) {
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      }
      return dataStoneData.birthday;
    })();
  }

  // Constrói o DTO (alinhado ao CandidatoInput)
  const dto: Partial<CandidatoInput> = {
    areaCandidato: 'OUTRO',
    emails,
    contatos,
    links: [], // API não fornece links
    pessoa: {
      nome: dataStoneData.name || '',
      cpf: dataStoneData.cpf ? formatCpf(dataStoneData.cpf) : null,
      rg: dataStoneData.rg || null,
      dataNascimento,
      signo: dataStoneData.sign,
      sexo: dataStoneData.gender === 'M' ? 'MASCULINO' : 'FEMININO',
      localizacoes,
      ...(socios.length > 0 && { socios }),
    },
  };

  return dto;
}
