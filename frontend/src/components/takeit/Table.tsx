import { useRouter } from 'next/router';

// Tipos para colunas e dados
export type TypeColumns = 'persons' | 'companies';

export interface TableColumn {
  label: string;
  key: string;
}

export interface Phone {
  ddd?: string;
  number?: string;
}

export interface Address {
  street?: string;
  number?: string | number;
  city?: string;
}

export interface PersonData {
  name?: string;
  cpf?: string | number;
  age?: string | number;
  birthday?: string;
  gender?: string;
  city?: string;
  addresses?: Address[];
  phone?: Phone[];
  mobile_phones?: Phone[];
  land_lines?: Phone[];
  ddd?: string;
  number?: string;
}

export interface CompanyData {
  company_name?: string;
  cnpj?: string | number;
  city?: string;
  addresses?: Address[];
}

export type TableData = PersonData | CompanyData;

export const columnsByType: Record<TypeColumns, TableColumn[]> = {
  persons: [
    { label: 'Nome', key: 'name' },
    { label: 'CPF', key: 'cpf' },
    { label: 'Idade', key: 'age' },
    { label: 'Data de Nascimento', key: 'birthday' },
    { label: 'Genêro', key: 'gender' },
    { label: 'Cidade', key: 'city' },
    { label: 'Estado', key: 'addresses' },
    { label: 'Telefone', key: 'phone' },
  ],
  companies: [
    { label: 'Razão Social', key: 'company_name' },
    { label: 'CNPJ', key: 'cnpj' },
    { label: 'Cidade', key: 'city' },
    { label: 'Estado', key: 'addresses' },
  ],
};

// 🔧 Função para normalizar os dados para colunas fixas
function normalizeDataForTable(data: TableData[] | undefined): unknown[] {
  if (!Array.isArray(data)) return [];

  return data.map(item => {
    const name =
      (item as PersonData).name || (item as CompanyData).company_name || '-';
    const cpf = (item as PersonData).cpf ?? '-';
    const age = (item as PersonData).age ?? '-';
    const gender = (item as PersonData).gender ?? '-';

    // Agrupa todos os telefones (mobile + land + simples)
    const phones: Phone[] = [];

    if (Array.isArray((item as PersonData).mobile_phones)) {
      phones.push(
        ...((item as PersonData).mobile_phones as Phone[]).map(p => ({
          ddd: p.ddd,
          number: p.number,
        }))
      );
    }

    if (Array.isArray((item as PersonData).land_lines)) {
      phones.push(
        ...((item as PersonData).land_lines as Phone[]).map(p => ({
          ddd: p.ddd,
          number: p.number,
        }))
      );
    }

    if ((item as PersonData).ddd && (item as PersonData).number) {
      phones.push({
        ddd: (item as PersonData).ddd,
        number: (item as PersonData).number,
      });
    }

    const city =
      (item as PersonData).city ??
      (Array.isArray((item as PersonData).addresses) &&
        (item as PersonData).addresses?.[0]?.city) ??
      null;

    const addresses = Array.isArray((item as PersonData).addresses)
      ? (item as PersonData).addresses
      : [];

    // Para companies, garantir cnpj e company_name
    if ('company_name' in item || 'cnpj' in item) {
      return {
        company_name: (item as CompanyData).company_name ?? '-',
        cnpj: (item as CompanyData).cnpj ?? '-',
        city: (item as CompanyData).city ?? '-',
        addresses: Array.isArray((item as CompanyData).addresses)
          ? (item as CompanyData).addresses
          : [],
      };
    }

    // Para persons
    return {
      name,
      cpf,
      age,
      phone: phones,
      city,
      addresses,
      gender,
    };
  });
}

// 🧾 Renderizador de célula com tratamento para arrays
function renderCellValue(value: unknown, key: string): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return '-';

    if (key === 'phone') {
      return value
        .map((p: Phone) =>
          p.ddd && p.number ? `(${p.ddd}) ${p.number}` : p.number || '-'
        )
        .join(', ');
    }

    if (key === 'addresses') {
      return value
        .map((a: Address) =>
          a.street ? `${a.street}${a.number ? ', ' + a.number : ''}` : '-'
        )
        .join(' | ');
    }

    return value.join(', ');
  }

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }

  if (key === 'cpf' && value && value.toString().length < 11) {
    return value.toString().padStart(11, '0');
  }

  return value !== undefined && value !== null && value !== ''
    ? String(value)
    : '-';
}

// 🧩 Linha da tabela
interface TRProps {
  onSelect?: (item: any) => void;
  item: any;
  columns: TableColumn[];
}

function TR({ onSelect, item, columns }: TRProps) {
  const router = useRouter();

  return (
    <tr
      className="result-row"
      onClick={() => {
        let cpf = item.cpf;
        if (cpf && cpf.toString().length < 11) {
          cpf = cpf.toString().padStart(11, '0');
        }
        let component = '/take-it/view-person';
        if ('cnpj' in item) {
          component = '/take-it/view-company';
        }
        router.push(`${component}/${cpf ?? item.cnpj}`);
      }}
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
    >
      {columns.map(col => (
        <td key={col.key}>{renderCellValue(item[col.key], col.key)}</td>
      ))}
    </tr>
  );
}

// 📊 Componente principal
interface TableProps {
  data: TableData[] | undefined;
  onSelect?: (item: unknown) => void;
  typeColumns: TypeColumns;
  loading: boolean;
}

function Table({ data, onSelect, typeColumns, loading }: TableProps) {
  const normalizedData = normalizeDataForTable(data);

  // Pegamos apenas as colunas fixas que existem em columnsByType
  const columns: TableColumn[] =
    typeColumns === 'persons'
      ? columnsByType[typeColumns]?.filter(col =>
          [
            'name',
            'cpf',
            'age',
            'phone',
            'city',
            'addresses',
            'gender',
          ].includes(col.key)
        )
      : columnsByType[typeColumns] || [];

  return (
    <div className="overflow-x-auto w-full ">
      <table
        className="min-w-full border-separate border-spacing-0 bg-white rounded-lg"
        style={{ borderCollapse: 'separate', borderSpacing: 0 }}
      >
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-semibold bg-neutral text-primary"
                style={{ position: 'sticky', top: 0, zIndex: 1 }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="relative">
          {loading && (
            <tr>
              <td
                colSpan={columns.length}
                style={{ height: '120px', padding: 0 }}
              >
                <div className="flex justify-center items-center h-[120px] w-full">
                  <svg
                    className="animate-spin h-8 w-8 text-[rgb(72,3,138)]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </div>
              </td>
            </tr>
          )}
          {!data || (data.length === 0 && !loading) ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-primary font-medium"
              >
                Nenhum resultado encontrado.
              </td>
            </tr>
          ) : (
            normalizedData.map((item, i) => (
              <TR item={item} onSelect={onSelect} key={i} columns={columns} />
            ))
          )}
        </tbody>
      </table>
      <style>
        {`
          .result-row:not(:last-child) td {
            border-bottom: 1px solid rgba(72, 3, 138, 0.2);
          }
          .result-row td, .result-row th {
            vertical-align: middle;
            padding: 12px 16px;
          }
          .result-row:hover {
            background-color: #f3eafd;
            transition: background 0.2s;
          }
        `}
      </style>
    </div>
  );
}

export default Table;
