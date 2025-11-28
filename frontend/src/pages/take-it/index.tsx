import api from '@/axios';
import Table, { TableColumn } from '@/components/Table';
import PersonDetailsModal from '@/components/takeit/PersonDetailsModal';
import SearchForm, { SearchType } from '@/components/takeit/SearchForm';
import { useSearchContext } from '@/context/SearchTakeitContext';
import TakeitLayout from '@/layout/takeitLayout';
import styles from '@/styles/takeit.module.scss';
import { handleZeroLeft } from '@/utils/helper/helperCPF';
import { mask } from '@/utils/mask/mask';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Tipos para os dados de resultado e item selecionado
type TypeColumns = 'persons' | 'companies';

interface PersonResult {
  id: string | number;
  type: 'persons';
  nome?: string;
  cpf?: string;
  email?: string;
  endereco?: string;
  cep?: string;
  [key: string]: any;
}
interface CompanyResult {
  id: string | number;
  type: 'companies';
  razaoSocial?: string;
  cnpj?: string;
  email?: string;
  [key: string]: any;
}

type ResultItem = PersonResult | CompanyResult;

// Definição das colunas para cada tipo de resultado
const columnsPerson: TableColumn<PersonResult>[] = [
  {
    label: 'Id',
    hiddeBtnCopy: true,
    key: 'order',
    render: row => row.order ?? '-',
  },
  {
    label: 'Nome',
    key: 'nome',
    render: row => row.nome ?? row.name ?? '-',
  },
  {
    label: 'CPF',
    key: 'cpf',
    render: row => {
      if (!row.cpf) return '-';

      return mask(handleZeroLeft(row.cpf), 'cpf');
    },
  },
  // {
  //   label: 'Email',
  //   key: 'email',
  //   render: row => {
  //     if (Array.isArray(row.emails) && row.emails.length > 0) {
  //       return <span>{row.emails.map(email => email.email).join(', ')}</span>;
  //     }
  //     if (row.email) {
  //       return row.email;
  //     }
  //     return '-';
  //   },
  // },
  {
    label: 'Endereço',
    hiddeBtnCopy: true,
    key: 'endereco',
    render: row => {
      let result = '';

      if (row.endereco) {
        result = row.endereco;
      }

      if (row.city || row.city) {
        result = `${row.city}/${row.district}`;
      }

      return result || '-';
    },
  },
  {
    label: 'Idade',
    key: 'age',
    render: row => row.age ?? '-',
    hiddeBtnCopy: true,
  },
];

const columnsCompany: TableColumn<CompanyResult>[] = [
  {
    label: 'Razão Social',
    key: 'razaoSocial',
    render: row =>
      row.razaoSocial ?? row.razao_social ?? row.company_name ?? '-',
  },
  {
    label: 'CNPJ',
    key: 'cnpj',
    render: row => row.cnpj ?? '-',
  },
  {
    label: 'Nome Fantasia',
    key: 'nome_fantasia',
    render: row =>
      row.nomeFantasia ?? row.nome_fantasia ?? row.trading_name ?? '-',
  },
  {
    label: 'Uf',
    key: 'uf',
    render: row => row.uf ?? '-',
  },
];

// Componente principal
const TakeItContent: React.FC = () => {
  const [typeColumns, setTypeColumns] = useState<TypeColumns>('persons');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<ResultItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { lastSearchParams, setSearchData } = useSearchContext();
  const restoredSearch = useRef(false);
  const router = useRouter();

  const handleSearch = useCallback(
    async (
      input: string,
      uf: string,
      options: { filial: boolean },
      descriptionData: SearchType,
      overrideType?: TypeColumns
    ) => {
      const currentType = overrideType ?? typeColumns;
      setLoading(true);
      setError(null);
      setResults(null);

      try {
        const response = await api.get('/api/externalWithAuth/take-it/search', {
          params: {
            query: input,
            tipo: currentType,
            typeData: descriptionData,
            ...options,
            uf,
          },
        });

        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        setResults(data);
        setSearchData({
          searchTerm: input,
          lastSearchParams: {
            input,
            uf,
            options,
            descriptionData,
            typeColumns: currentType,
          },
        });
      } catch (erro: any) {
        console.log(erro);
        setError(
          erro?.response?.data?.details?.mensagem ||
            erro?.response?.data?.error ||
            'Erro ao buscar dados.'
        );
        setResults(null);
      } finally {
        setLoading(false);
      }
    },
    [typeColumns, setSearchData]
  );

  useEffect(() => {
    if (restoredSearch.current) return;
    if (!lastSearchParams) {
      restoredSearch.current = true;
      return;
    }

    restoredSearch.current = true;
    const savedType = lastSearchParams.typeColumns ?? 'persons';
    setTypeColumns(savedType);

    handleSearch(
      lastSearchParams.input,
      lastSearchParams.uf,
      lastSearchParams.options,
      lastSearchParams.descriptionData as SearchType,
      savedType
    );
  }, [lastSearchParams, handleSearch]);

  const handleSelectItem = (item: ResultItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleCategoryChange = (category: TypeColumns) => {
    setTypeColumns(category);
  };

  const columns =
    typeColumns === 'persons'
      ? (columnsPerson as TableColumn<ResultItem>[])
      : (columnsCompany as TableColumn<ResultItem>[]);

  const onRowClick = (row: ResultItem) => {
    setSelectedItem(row);
    let url = null;

    if (row?.cpf) {
      const cpf = handleZeroLeft(row.cpf);
      url = `/take-it/view-person/${cpf}`;
    } else if (row?.cnpj) {
      url = `/take-it/view-company/${row?.cnpj}`;
    } else {
      setError('CPF ou CNPJ não encontrados, contato o Administrador');
    }

    if (!url) {
      setError('Erro ao acessar a url, contate o Administrador');
      return;
    }

    router.push(url);
  };

  return (
    <>
      <div className="transition-all duration-2000 bg-white w-full mb-5 flex flex-col-reverse md:flex-col">
        <div className="p-4 flex flex-col justify-center items-center">
          <p className="text-primary mb-2">
            Selecione uma informação para consultar:
          </p>

          <SearchForm
            handleSearch={handleSearch}
            loading={loading}
            typeColumns={typeColumns}
            initialSearchParams={
              lastSearchParams
                ? {
                    input: lastSearchParams.input,
                    uf: lastSearchParams.uf,
                    options: lastSearchParams.options ?? { filial: false },
                    descriptionData:
                      (lastSearchParams.descriptionData as SearchType) ?? null,
                  }
                : undefined
            }
          />
        </div>

        <div className="flex w-full justify-center items-center border-b border-gray-300">
          <button
            className={`text-[1.3em] font-semibold cursor-pointer text-primary transition-colors duration-300 grow max-w-[140px]  ${
              typeColumns === 'persons' &&
              'font-black border-b-primary border-b-2'
            }`}
            onClick={() => handleCategoryChange('persons')}
          >
            Consumidores
          </button>
          <button
            className={`text-[1.3em] font-semibold cursor-pointer text-primary transition-colors duration-300 grow max-w-[140px] px-2 ${
              typeColumns === 'companies' &&
              'font-black border-b-primary border-b-2'
            }`}
            onClick={() => handleCategoryChange('companies')}
          >
            Empresas
          </button>
        </div>
      </div>

      {error && (
        <div
          className={`${styles.errorMessage} bg-red-200 rounded-md px-6 py-2 font-bold`}
        >
          {error}
        </div>
      )}

      <div className={`${styles.container} shadow-md p-4`}>
        <Table
          data={Array.isArray(results) ? results : []}
          columns={columns}
          loading={loading}
          emptyMessage="Nenhum resultado encontrado."
          onRowClick={onRowClick}
        />

        {selectedItem && (
          <PersonDetailsModal
            itemId={selectedItem.id}
            type={selectedItem.type}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </>
  );
};

const TakeItPage: React.FC = () => (
  <TakeitLayout>
    <TakeItContent />
  </TakeitLayout>
);

export default TakeItPage;
