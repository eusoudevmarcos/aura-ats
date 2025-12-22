import { ClienteWithEmpresaInput } from '@/schemas/cliente.schema';
import {
  StatusClienteEnum,
  StatusClienteEnumInput,
} from '@/schemas/statusClienteEnum.schema';
import { TipoSocio } from './dataStoneCandidato.dto';

// Tipos baseados em [cnpj].tsx (14-97)
export interface DataStoneCompanyApiResponse {
  company_name?: string;
  cnpj: string | number;
  trading_name?: string;
  creation_date?: string;
  estimated_revenue?: string;
  share_capital?: string;
  city_uf?: string;
  segment?: string;
  age?: string;
  employee_count?: string;
  headquarter_type?: string;
  business_size?: string;
  registry_situation?: string;
  cnae_code?: string;
  cnae_description?: string;
  juridical_type?: string;
  addresses?: Address[];
  mobile_phones?: Phone[];
  land_lines?: Phone[];
  emails?: Email[];
  related_persons?: RelatedPerson[];
  legal_representative?: LegalRepresentative[];
  branch_offices?: BranchOffice[];
  related_companies?: RelatedCompany[];
  related_emails?: RelatedEmail[];
  simple_simei?: SimpleSimei;
  [key: string]: any;
}

export interface Address {
  type?: string;
  street?: string;
  number?: string | number;
  complement?: string;
  neighborhood?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  priority?: string;
}
export interface Phone {
  ddd?: string;
  number?: string;
  priority?: string;
}
export interface Email {
  email?: string;
  priority?: string;
}
export interface RelatedPerson {
  name?: string;
  cpf: string;
  description?: string;
  ownership?: string;
}
export interface LegalRepresentative {
  name?: string;
  cpf?: string;
  qualification?: string;
}
export interface BranchOffice {
  company_name?: string;
  cnpj: string;
  ds_branch_office?: string;
}
export interface RelatedCompany {
  name?: string;
  cnpj: string;
  description?: string;
  ownership?: string;
}
export interface RelatedEmail {
  email?: string;
}
export interface SimpleSimei {
  status_simple?: string;
  dt_option_simple?: string;
  status_simei?: string;
  dt_option_simei?: string;
}

// Função que normaliza o formato ClienteWithEmpresaInput a partir da resposta DataStone
function formatPhoneDDDNumber(ddd?: string, number?: string) {
  if (!ddd || !number) return '';
  // Remove não numéricos
  const cleanDDD = ddd.toString().replace(/\D/g, '');
  const cleanNumber = number.toString().replace(/\D/g, '');
  return `(${cleanDDD}) ${cleanNumber}`;
}

function formatCpf(cpf: string | undefined): string | null {
  if (!cpf) return null;
  const cpfStr = cpf.toString().replace(/\D/g, '').padStart(11, '0');
  return cpfStr;
}

function formatCnpj(cnpj: string | number | undefined): string {
  if (typeof cnpj === 'undefined' || cnpj === null) return '';
  let cnpjStr = cnpj.toString().replace(/\D/g, '');
  // Se for cpf (tamanho 11 ou 10 ou menor), faz fix para 11
  if (cnpjStr.length <= 11) {
    // Se faltar só 1 número (10 chars), adiciona um zero à esquerda
    if (cnpjStr.length === 10) {
      cnpjStr = cnpjStr.padStart(11, '0');
    }
    // Se tiver menos que 10, continua a preencher (ou já é inválido e sempre completa para 11)
    else if (cnpjStr.length < 11) {
      cnpjStr = cnpjStr.padStart(11, '0');
    }
    return cnpjStr;
  }
  // Normal para cnpj: 14 dígitos.
  return cnpjStr.padStart(14, '0');
}

function mapTipoSocio(description?: string): TipoSocio {
  if (!description) return TipoSocio.SOCIO;

  const descLower = description.toLowerCase();
  if (
    descLower.includes('49') ||
    descLower.includes('sócio-administrador') ||
    descLower.includes('socio-administrador')
  ) {
    return TipoSocio.ADMINISTRADOR;
  }
  if (
    descLower.includes('representante') ||
    descLower.includes('representa') ||
    descLower.includes('legal')
  ) {
    return TipoSocio.REPRESENTANTE;
  }
  if (descLower.includes('administrador') || descLower.includes('admin')) {
    return TipoSocio.ADMINISTRADOR;
  }
  return TipoSocio.SOCIO;
}

export function convertDataStoneToClienteWithEmpresaInput(
  data: DataStoneCompanyApiResponse,
  status: StatusClienteEnumInput = StatusClienteEnum.enum.PROSPECT
): ClienteWithEmpresaInput {
  // Telefones (celulares preferencialmente)
  const telefones: string[] = [];
  if (Array.isArray(data.mobile_phones)) {
    for (const phone of data.mobile_phones) {
      const str = formatPhoneDDDNumber(phone.ddd, phone.number);
      if (str && str.trim().length > 4) telefones.push(str);
    }
  }
  if (Array.isArray(data.land_lines)) {
    for (const phone of data.land_lines) {
      const str = formatPhoneDDDNumber(phone.ddd, phone.number);
      if (str && str.trim().length > 4) telefones.push(str);
    }
  }

  // Emails (apenas endereço de e-mail)
  const emails: string[] = Array.isArray(data.emails)
    ? (data.emails
        .map(e => (typeof e.email === 'string' ? e.email : null))
        .filter(Boolean) as string[])
    : [];

  // Socios normalizados para o formato ClienteWithEmpresaInput.empresa.socios
  const socios =
    data.related_persons
      ?.filter(person => person.cpf && person.name)
      .map(person => ({
        tipoSocio: mapTipoSocio(person.description),
        pessoa: {
          nome: person.name || '',
          cpf: formatCpf(person.cpf),
          // Em ClienteWithEmpresaInput, campos opcionais: rg, dataNascimento
        },
      })) ?? [];

  // Representantes normalizados (Ajuste: só para pessoas que tenham description indicando representante)
  const representantes =
    data.related_persons
      ?.filter(
        rep =>
          rep.cpf &&
          rep.name &&
          mapTipoSocio(rep.description) === TipoSocio.REPRESENTANTE
      )
      .map(rep => ({
        nome: rep.name || '',
        cpf: formatCpf(rep.cpf) as string | null,
        // localizacoes obrigatório no schema, mas aqui inicializado vazio (precisa ser preenchido conforme localidade do schema)
        localizacoes: [], // Não temos UF/cidade no related_persons do DataStone
        // Campos extras opcionais
        id: undefined,
        rg: undefined,
        dataNascimento: undefined,
        sexo: undefined,
        signo: undefined,
      })) ?? [];
  // Normalização dos campos base de empresa (com campos obrigatórios do schema)
  const empresa = {
    cnpj: formatCnpj(data.cnpj),
    razaoSocial: data.company_name || '',
    nomeFantasia: data.trading_name || '',
    dataAbertura: data.creation_date,
    ...(representantes.length > 0 ? { representantes } : {}),
    ...(socios.length > 0 ? { socios } : {}),
    ...(telefones.length > 0 ? { telefones } : {}),
    ...(emails.length > 0 ? { emails } : {}),
  };

  // Montagem do DTO tipado como ClienteWithEmpresaInput
  // status: obrigatório
  // empresa: obrigatório
  const clienteWithEmpresaInput: ClienteWithEmpresaInput = {
    status,
    empresa,
    ...(emails.length > 0 ? { emails } : {}),
    ...(telefones.length > 0 ? { telefones } : {}),
  };

  return clienteWithEmpresaInput;
}
