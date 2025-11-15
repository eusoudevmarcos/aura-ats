import { StatusCliente, TipoSocio } from "@prisma/client";

/**
 * Interface para os dados recebidos da API DataStone (Empresa/Cliente)
 */
export interface DataStoneCompanyApiResponse {
  cnpj: number;
  company_name: string;
  trading_name?: string;
  creation_date?: string | null;
  estimated_revenue?: string;
  share_capital?: number;
  city_uf?: string;
  segment?: string;
  age?: string;
  employee_count?: string;
  headquarter_type?: string;
  business_size?: string;
  registry_situation?: string;
  cnae_code?: number;
  cnae_description?: string;
  juridical_type_id?: number;
  juridical_type?: string;
  addresses?: DataStoneCompanyAddress[];
  mobile_phones?: DataStoneCompanyPhone[];
  land_lines?: DataStoneCompanyPhone[];
  emails?: DataStoneCompanyEmail[];
  related_persons?: DataStoneCompanyPerson[];
  legal_representative?: DataStoneLegalRepresentative[];
  related_companies?: DataStoneRelatedCompany[];
  branch_offices?: DataStoneBranchOffice[];
  related_emails?: DataStoneCompanyEmail[];
  simple_simei?: DataStoneSimpleSimei;
  [key: string]: any; // Para campos adicionais que não serão mapeados
}

interface DataStoneCompanyAddress {
  type?: string | null;
  street?: string | null;
  number?: number | string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  district?: string | null;
  postal_code?: string | null;
  priority?: number;
}

interface DataStoneCompanyPhone {
  ddd: number;
  number: number | string;
  priority?: number;
  cdr_datetime?: string | null;
  hot_datetime?: number | null;
  whatsapp_datetime?: number | string | null;
  cpc_datetime?: number | null;
  [key: string]: any;
}

interface DataStoneCompanyEmail {
  email: string;
  priority?: number;
}

interface DataStoneCompanyPerson {
  cpf: number;
  name: string;
  description?: string;
  priority?: number;
  ownership?: number;
}

interface DataStoneLegalRepresentative {
  name: string;
  cpf: number;
  qualification?: string;
}

interface DataStoneRelatedCompany {
  cnpj: number;
  name: string;
  priority?: number;
  description?: string;
  ownership?: number;
}

interface DataStoneBranchOffice {
  cnpj: string;
  company_name: string;
  root_cnpj?: string;
  ds_branch_office?: string;
}

interface DataStoneSimpleSimei {
  status_simei?: string;
  dt_option_simei?: string;
  status_simple?: string;
  dt_option_simple?: string;
}

/**
 * DTO para criar Cliente com todas as relações aninhadas
 * Formato compatível com o Prisma e o buildClienteData
 *
 * A estrutura segue exatamente as relações do banco de dados:
 * - Cliente -> Empresa (1:1)
 * - Empresa -> Localizacao[] (1:N)
 * - Empresa -> Socio[] (1:N)
 * - Empresa -> Pessoa[] (representantes) (1:N) - através da relação "EmpresaRepresentantes"
 * - Socio -> Pessoa (N:1)
 *
 * Nota: Os representantes são criados como Pessoas e automaticamente conectados
 * à empresa através do campo empresaRepresentadaId pela relação "EmpresaRepresentantes"
 */
export interface DataStoneClienteDTO {
  status: StatusCliente;
  empresa: {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    dataAbertura: Date | null;
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
      pessoa: {
        nome: string;
        cpf: string | null;
        rg?: string | null;
        dataNascimento?: Date | null;
      };
    }>;
    representantes?: Array<{
      nome: string;
      cpf: string | null;
      rg?: string | null;
      dataNascimento?: Date | null;
    }>;
  };
}

/**
 * Converte o tipo de sócio da descrição da API para o enum TipoSocio
 */
function mapTipoSocio(description?: string): TipoSocio {
  if (!description) return TipoSocio.SOCIO;

  const descLower = description.toLowerCase();

  // Verifica códigos comuns de descrição
  if (
    descLower.includes("49") ||
    descLower.includes("sócio-administrador") ||
    descLower.includes("socio-administrador")
  ) {
    return TipoSocio.ADMINISTRADOR;
  }
  if (
    descLower.includes("representante") ||
    descLower.includes("representa") ||
    descLower.includes("legal")
  ) {
    return TipoSocio.REPRESENTANTE;
  }
  if (descLower.includes("administrador") || descLower.includes("admin")) {
    return TipoSocio.ADMINISTRADOR;
  }
  return TipoSocio.SOCIO;
}

/**
 * Formata telefone para string "DDDNUMERO"
 */
function formatPhone(ddd: number, number: number | string): string {
  // Remove caracteres não numéricos do número
  const cleanNumber = number.toString().replace(/\D/g, "");
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
  const cpfStr = cpf.toString().padStart(11, "0");
  return cpfStr;
}

/**
 * Converte CNPJ de number para string formatada
 */
function formatCnpj(cnpj: number | string): string {
  const cnpjStr = cnpj.toString().padStart(14, "0");
  return cnpjStr;
}

/**
 * Converte o JSON da API DataStone para o formato do banco de dados
 *
 * @example
 * ```typescript
 * const apiData = {
 *   cnpj: 12345678000123,
 *   company_name: "PANIFICADORA JOÃO DA SILVA ME",
 *   trading_name: "Padaria e Confeitaria Sabores",
 *   creation_date: "1990-01-31",
 *   addresses: [...],
 *   related_persons: [...],
 *   legal_representative: [...]
 * };
 *
 * const dto = convertDataStoneToClienteDTO(apiData);
 * // Agora você pode usar o dto com buildClienteData e salvar no banco
 * const clienteData = await buildClienteData(dto);
 * ```
 *
 * @param dataStoneData Dados recebidos da API DataStone
 * @param status Status do cliente (default: PROSPECT)
 * @returns DTO formatado para criação de Cliente no Prisma com todas as relações aninhadas
 */
export function convertDataStoneToClienteDTO(
  dataStoneData: DataStoneCompanyApiResponse,
  status: StatusCliente = StatusCliente.PROSPECT
): DataStoneClienteDTO {
  // Mapeia endereços para localizações
  const localizacoes =
    dataStoneData.addresses
      ?.filter((addr) => {
        // Filtra endereços inválidos (sem cidade ou sem informações básicas)
        return (
          addr.city || addr.postal_code || (addr.street && addr.neighborhood)
        );
      })
      .map((addr) => ({
        cep: addr.postal_code || null,
        cidade: addr.city || null,
        bairro: addr.neighborhood || null,
        uf: addr.district || "SP", // Default para SP se não informado
        estado: addr.district || null,
        complemento: addr.complement || null,
        logradouro: addr.street || null,
        descricao: addr.type || null,
      })) || [];

  // Mapeia pessoas relacionadas (sócios)
  const socios =
    dataStoneData.related_persons
      ?.filter((person) => person.cpf && person.name)
      .map((person) => ({
        tipoSocio: mapTipoSocio(person.description),
        pessoa: {
          nome: person.name,
          cpf: formatCpf(person.cpf),
          rg: null,
          dataNascimento: null, // API não fornece data de nascimento para sócios
        },
      })) || [];

  // Mapeia representantes legais
  const representantes =
    dataStoneData.legal_representative
      ?.filter((rep) => rep.cpf && rep.name)
      .map((rep) => ({
        nome: rep.name,
        cpf: formatCpf(rep.cpf),
        rg: null,
        dataNascimento: null, // API não fornece data de nascimento para representantes
      })) || [];

  // Constrói o DTO
  const dto: DataStoneClienteDTO = {
    status,
    empresa: {
      cnpj: formatCnpj(dataStoneData.cnpj),
      razaoSocial: dataStoneData.company_name || "",
      nomeFantasia: dataStoneData.trading_name || "",
      dataAbertura: parseDate(dataStoneData.creation_date),
      localizacoes,
      ...(socios.length > 0 && { socios }),
      ...(representantes.length > 0 && { representantes }),
    },
  };

  return dto;
}
