import api from '@/axios';
import SearchForm from '@/components/takeit/SearchForm';
import styles from '@/styles/takeit.module.scss';
import { useState } from 'react';

type TypeColumns = 'persons' | 'companies';

interface SearchOptions {
  [key: string]: any;
}

interface Props {
  children: (layoutData: {
    results: any;
    loading: boolean;
    error: string | null;
    typeColumns: TypeColumns;
    handleSearch: (...args: any[]) => Promise<void>;
  }) => React.ReactNode;
  fit?: boolean;
}

export default function TakeitLayout({ children, fit }: Props) {
  const [typeColumns, setTypeColumns] = useState<TypeColumns>('persons');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState(null);

  const handleSearch = async (
    input: string,
    uf: string,
    options: SearchOptions
  ) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await api.get('/api/externalWithAuth/take-it/search', {
        params: {
          query: input,
          tipo: typeColumns,
          ...options,
          uf,
        },
      });
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setResults(data);
    } catch (erro: any) {
      console.log(erro);
      setError(
        erro?.response?.data?.details?.mensagem ||
          erro?.response?.data.error ||
          'Erro ao buscar dados.'
      );
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: TypeColumns) => {
    setTypeColumns(category);
  };

  return (
    <section className="flex flex-col bg-white max-w-7xl rounded-2xl mx-auto shadow-md">
      <h1
        className={`w-full text-center text-primary font-black text-4xl my-4`}
      >
        TAKE IT
      </h1>

      <div className="transition-all duration-2000 bg-white rounded-xl w-full shadow-md mb-5 flex flex-col-reverse md:flex-col">
        <div className="p-4">
          {typeColumns === 'persons' ? (
            <p>Pesquise CPF, Nome completo, CEP, Endereço completo, Email</p>
          ) : (
            <p>Pesquise CNPJ, Razão social, Email</p>
          )}

          <SearchForm
            handleSearch={handleSearch}
            loading={loading}
            typeColumns={typeColumns}
          />
        </div>

        {!fit && (
          <div className="flex md:mt-6 md:mb-0 mb-4 w-full justify-center">
            <button
              className={`text-[1.3em] font-semibold cursor-pointer text-primary transition-colors duration-300 flex-grow max-w-[200px] ${
                typeColumns === 'persons' &&
                'font-black border-b-primary border-b-2'
              }`}
              onClick={() => handleCategoryChange('persons')}
            >
              Consumidores
            </button>
            <button
              className={`text-[1.3em] font-semibold cursor-pointer text-primary transition-colors duration-300 flex-grow max-w-[200px] ${
                typeColumns === 'companies' &&
                'font-black border-b-primary border-b-2'
              }`}
              onClick={() => handleCategoryChange('companies')}
            >
              Empresas
            </button>
          </div>
        )}
      </div>

      {error && (
        <div
          className={`${styles.errorMessage} bg-red-200 rounded-md px-6 py-2 font-bold`}
        >
          {error}
        </div>
      )}
      {loading && (
        <div className={`${styles.loadingMessage} message-box`}>
          Carregando...
        </div>
      )}

      {children({ results, loading, error, handleSearch, typeColumns })}
    </section>
  );
}
