import { useState } from "react";
import { searchApi } from "@/axios/searchApi";
import SearchForm from "@/components/takeit/SearchForm";
import styles from "@/styles/takeit.module.scss";
import { HomeIcon } from "@/components/icons";
import Link from "next/link";

type TypeColumns = "persons" | "companies";

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
  const [typeColumns, setTypeColumns] = useState<TypeColumns>("persons");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState(null);

  /**
   * Realiza a busca usando a API.
   * @param {string} input
   * @param {string} uf
   * @param {Object} options
   */
  const handleSearch = async (
    input: string,
    uf: string,
    options: SearchOptions
  ) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await searchApi(input, typeColumns, { ...options, uf });
      setResults(data.data);
    } catch (erro: any) {
      setError(erro?.message || "Erro ao buscar dados.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: TypeColumns) => {
    setTypeColumns(category);
  };

  return (
    <section
      className="flex flex-col bg-white max-w-7xl p-4 rounded-2xl mx-auto mt-4 shadow-md"
      style={{
        padding: "16px",
      }}
    >
      <div className="flex justify-between items-center">
        <Link href="/dashboard" className="buttonPrimary text-nowrap">
          <HomeIcon />
          Aura ATS
        </Link>
        <h1 className={`w-full text-center ${styles.h1}`}>TAKE IT</h1>
      </div>

      <div
        className={`${styles.container} shadow-md`}
        style={{ marginBottom: "20px", padding: "16px" }}
      >
        {typeColumns === "persons" ? (
          <p>Pesquise CPF, Nome completo, CEP, Endereço completo, Email</p>
        ) : (
          <p>Pesquise CNPJ, Razão social, Email</p>
        )}

        <SearchForm
          handleSearch={handleSearch}
          loading={loading}
          typeColumns={typeColumns}
        />

        {!fit && (
          <div className={styles.categoryNavigation}>
            <button
              className={`${styles.categoryButton} ${
                typeColumns === "persons" ? styles.active : ""
              }`}
              onClick={() => handleCategoryChange("persons")}
            >
              Consumidores
            </button>
            <button
              className={`${styles.categoryButton} ${
                typeColumns === "companies" ? styles.active : ""
              }`}
              onClick={() => handleCategoryChange("companies")}
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
