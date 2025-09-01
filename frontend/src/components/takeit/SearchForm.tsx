'use client';

// frontend/src/components/SearchForm.tsx
import styles from '@/styles/animations.module.css'; // Importação correta do CSS Modules no Next.js
import takeitStyles from '@/styles/takeit.module.scss';
import { UF_MODEL } from '@/utils/UF';
import { mask } from '@/utils/mask/mask';
import { sanitize } from '@/utils/sanitize';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';

// Definindo os tipos para as props
type TypeColumns = 'persons' | 'companies';

interface SearchFormProps {
  handleSearch: (
    input: string,
    uf: string,
    options: { filial: boolean }
  ) => void;
  loading: boolean;
  typeColumns: TypeColumns;
}

const SearchForm: React.FC<SearchFormProps> = ({
  handleSearch,
  loading,
  typeColumns,
}) => {
  const [input, setInput] = useState<string>('');
  const [descriptionData, setDescriptionData] = useState<string>('');
  const [disableBtn, setDisableBtn] = useState<boolean>(true);
  const [uf, setUf] = useState<string>('');
  const [isFiliar, setIsFiliar] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const maskedValue = mask(rawValue);
    setDisableBtn(true);
    const textSanitize = sanitize(maskedValue, typeColumns);

    // Se isFiliar for true, só aceita CNPJ
    if (isFiliar) {
      if (textSanitize?.tipo === 'cnpj') {
        setDescriptionData('CNPJ');
        setDisableBtn(false);
      } else {
        setDescriptionData('');
        setDisableBtn(true);
      }
      setInput(maskedValue);
      return;
    }

    if (textSanitize?.tipo) {
      setDescriptionData(textSanitize?.tipo.toUpperCase());

      if (textSanitize?.tipo.includes('name')) {
        setDescriptionData('NOME');
      }

      setDisableBtn(false);
    } else {
      setDescriptionData('');
    }

    setInput(maskedValue);
  };

  const handleUfChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setUf(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const options = {
      filial: isFiliar,
    };
    handleSearch(input, uf, options);
  };

  return (
    <form
      className={`
        ${takeitStyles.searchForm}
        flex flex-col gap-2 w-full justify-between
        md:flex-row md:items-end
      `}
      onSubmit={handleSubmit}
    >
      <section className="flex relative w-full max-w-full flex-wrap md:max-w-[400px]">
        {!!descriptionData && (
          <div
            className={`absolute top-0 right-0 border-r-2 border-primary bg-neutral-50 h-full flex justify-center items-center px-2 font-bold transition-all duration-300 ease-in-out rounded-lg
            ${
              descriptionData
                ? 'translate-x-0 opacity-100'
                : 'translate-x-full opacity-0'
            } ${styles.slideInFromRight}`}
            style={{
              transform: 'translateX(100%)',
              opacity: 0,
              // A animação agora é aplicada via classe do CSS Module
            }}
          >
            {descriptionData}
          </div>
        )}

        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="PESQUISAR"
          disabled={loading}
          autoComplete="off"
          className={`
            w-full rounded-lg pl-4 border-2
            ${input !== '' ? ' border-primary' : ''}
            min-h-[44px]
          `}
        />
      </section>

      <div className="flex flex-col gap-2 flex-wrap w-full md:flex-row md:w-auto md:items-end">
        {typeColumns === 'companies' && (
          <section className="flex items-center gap-2 cursor-pointer">
            <input
              id="filial"
              className="accent-[#48038a]"
              type="checkbox"
              checked={isFiliar}
              onChange={() => {
                setIsFiliar(!isFiliar);
              }}
            />
            <label htmlFor="filial" className="cursor-pointer">
              Filial
            </label>
          </section>
        )}
        <section className="flex flex-wrap w-full md:w-auto">
          <select
            id="uf"
            name="uf"
            className="w-full rounded-lg border-2 min-h-[44px] md:w-auto"
            value={uf}
            onChange={handleUfChange}
          >
            {UF_MODEL.map(({ value, label }, index) => (
              <option key={index} value={value ?? ''}>
                {label}
              </option>
            ))}
          </select>
        </section>

        <section className="w-full md:w-auto">
          <PrimaryButton
            type="submit"
            disabled={loading || disableBtn}
            className="bg-primary rounded-lg p-4 w-full flex justify-center items-center disabled:bg-[#48038a70] md:w-15"
          >
            {loading ? (
              <svg
                className="animate-spin h-6 w-6 text-primary"
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
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
            )}
          </PrimaryButton>
        </section>
      </div>
    </form>
  );
};

export default SearchForm;
