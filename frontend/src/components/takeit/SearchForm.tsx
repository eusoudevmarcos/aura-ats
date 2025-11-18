'use client';

// frontend/src/components/SearchForm.tsx
import takeitStyles from '@/styles/takeit.module.scss';
import { UF_MODEL } from '@/utils/UF';
import { mask } from '@/utils/mask/mask';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';

// VALIDATORS
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

const validateCPF = (cpf: string): boolean => {
  const cpfRaw = cpf.replace(/\D/g, '');
  if (cpfRaw.length !== 11 || /^(\d)\1{10}$/.test(cpfRaw)) return false;
  let sum = 0,
    rest;
  for (let i = 1; i <= 9; i++)
    sum += parseInt(cpfRaw.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpfRaw.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum += parseInt(cpfRaw.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpfRaw.substring(10, 11))) return false;
  return true;
};

const validateCNPJ = (cnpj: string): boolean => {
  const cnpjRaw = cnpj.replace(/[^\d]+/g, '');
  if (cnpjRaw.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpjRaw)) return false;
  let t = cnpjRaw.length - 2,
    d = cnpjRaw.substring(t),
    d1 = parseInt(d.charAt(0)),
    d2 = parseInt(d.charAt(1));
  let calc = (x: number) => {
    let n = cnpjRaw.substring(0, x),
      y = x - 7,
      s = 0,
      r = 0;
    for (let i = x; i >= 1; i--) {
      s += parseInt(n.charAt(x - i)) * y--;
      if (y < 2) y = 9;
    }
    r = 11 - (s % 11);
    return r > 9 ? 0 : r;
  };
  return calc(t) === d1 && calc(t + 1) === d2;
};

const validateCEP = (cep: string): boolean => {
  return /^\d{5}-?\d{3}$/.test(cep.trim());
};

const validatePhone = (phone: string): boolean => {
  return /^\(?\d{2}\)?[\s-]?9?\d{4}-?\d{4}$/.test(phone.trim());
};

const isPersonName = (str: string): boolean => {
  // Heurística simples: não ter números ou @, e pelo menos 2 palavras
  return /^[a-zA-ZÀ-ÿ\s']{5,}$/i.test(str.trim());
};

const isCompanyName = (str: string): boolean => {
  // Pode ser apenas um nome, como "STUDIO", com pelo menos 5 caracteres
  return /^[a-zA-ZÀ-ÿ0-9&.\s\-']{3,}$/i.test(str.trim());
};

// Definindo os tipos para as props
type TypeColumns = 'persons' | 'companies';

type SearchType =
  | 'CPF'
  | 'CNPJ'
  | 'EMAIL'
  | 'CEP'
  | 'PHONE'
  | 'NOME'
  | 'RAZAO_SOCIAL';

interface SearchFormProps {
  handleSearch: (
    input: string,
    uf: string,
    options: { filial: boolean },
    descriptionData: string
  ) => void;
  loading: boolean;
  typeColumns: TypeColumns;
}

const SEARCH_OPTIONS = [
  { label: 'CPF', type: 'CPF' },
  { label: 'CNPJ', type: 'CNPJ' },
  { label: 'Email', type: 'EMAIL' },
  { label: 'CEP', type: 'CEP' },
  { label: 'Telefone', type: 'PHONE' },
  { label: 'Nome', type: 'NOME' },
  { label: 'Razão Social', type: 'RAZAO_SOCIAL' },
];

// Função para retornar mensagens de erro personalizadas
const getValidationError = (input: string, type: SearchType | null): string => {
  if (!type || !input) return '';
  switch (type) {
    case 'EMAIL':
      if (!validateEmail(input))
        return 'Por favor, insira um email válido. Ex: exemplo@dominio.com';
      break;
    case 'CPF':
      if (input.replace(/\D/g, '').length !== 11)
        return 'O CPF deve conter 11 números.';
      if (!validateCPF(input))
        return 'CPF inválido. Verifique se digitou corretamente.';
      break;
    case 'CNPJ':
      if (input.replace(/\D/g, '').length !== 14)
        return 'O CNPJ deve conter 14 números.';
      if (!validateCNPJ(input))
        return 'CNPJ inválido. Verifique se digitou corretamente.';
      break;
    case 'CEP':
      if (!/^\d{5}-?\d{3}$/.test(input))
        return 'CEP inválido. Formato esperado: 00000-000';
      if (!validateCEP(input)) return 'CEP inválido.';
      break;
    case 'PHONE':
      if (!/^\(?\d{2}\)?[\s-]?9?\d{4}-?\d{4}$/.test(input))
        return 'Telefone inválido. Ex: (61) 90000-0000 ou 61900000000';
      if (!validatePhone(input)) return 'Telefone inválido.';
      break;
    case 'NOME':
      if (input.trim().length < 5)
        return 'Nome muito curto. Digite pelo menos 5 caracteres.';
      if (!/^[a-zA-ZÀ-ÿ\s']{5,}$/i.test(input.trim()))
        return 'Nome inválido. Apenas letras e espaços são permitidos.';
      break;
    case 'RAZAO_SOCIAL':
      if (input.trim().length < 5)
        return 'Razão social muito curta. Digite pelo menos 3 caracteres.';
      if (!/^[a-zA-ZÀ-ÿ0-9&.\s\-']{3,}$/i.test(input.trim()))
        return "Razão social inválida. Utilize apenas letras, números e caracteres permitidos (& . - ').";
      break;
    default:
      return '';
  }
  return '';
};

const SearchForm: React.FC<SearchFormProps> = ({
  handleSearch,
  loading,
  typeColumns,
}) => {
  const [input, setInput] = useState<string>('');
  const [selectedType, setSelectedType] = useState<SearchType | null>(null);
  const [disableBtn, setDisableBtn] = useState<boolean>(true);
  const [uf, setUf] = useState<string>('');
  const [isFiliar, setIsFiliar] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Defina os tipos disponíveis conforme typeColumns
  const typeButtons =
    typeColumns === 'persons'
      ? [
          { label: 'CPF', type: 'CPF' },
          { label: 'Email', type: 'EMAIL' },
          { label: 'CEP', type: 'CEP' },
          { label: 'Telefone', type: 'PHONE' },
          { label: 'Nome', type: 'NOME' },
        ]
      : [
          { label: 'CNPJ', type: 'CNPJ' },
          { label: 'Email', type: 'EMAIL' },
          { label: 'Razão Social', type: 'RAZAO_SOCIAL' },
        ];

  // Função para validar input de acordo com o tipo
  const validateInputByType = (value: string, type: SearchType | null) => {
    if (!type) return false;
    switch (type) {
      case 'EMAIL':
        return validateEmail(value);
      case 'CPF':
        return validateCPF(value);
      case 'CNPJ':
        return validateCNPJ(value);
      case 'CEP':
        return validateCEP(value);
      case 'PHONE':
        return validatePhone(value);
      case 'NOME':
        return isPersonName(value);
      case 'RAZAO_SOCIAL':
        return isCompanyName(value);
      default:
        return false;
    }
  };

  // Ao trocar input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInput(mask(rawValue));
    // Habilita botão só se houver tipo selecionado e input válido
    setDisableBtn(
      !selectedType || !validateInputByType(rawValue, selectedType)
    );
    setErrorMsg(getValidationError(rawValue, selectedType));
  };

  // Ao trocar tipo de busca
  const handleTypeChange = (searchType: SearchType) => {
    setSelectedType(searchType);
    // Avalia se o input atual é válido para esse tipo já ao selecionar
    setDisableBtn(!validateInputByType(input, searchType));
    setErrorMsg(getValidationError(input, searchType));
  };

  const handleUfChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setUf(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const options = {
      filial: isFiliar,
    };
    if (!selectedType || !validateInputByType(input, selectedType)) return;
    // descriptionData será agora o tipo (ex: CPF, NOME, EMAIL, etc)
    handleSearch(input, uf, options, selectedType);
  };

  return (
    <form
      className={`${takeitStyles.searchForm}
        flex flex-col gap-2 w-full justify-between
        md:flex-row md:items-end`}
      onSubmit={handleSubmit}
    >
      <section className="flex flex-col w-full max-w-full md:max-w-[400px]">
        <div className="flex gap-2 mb-1 flex-wrap">
          {typeButtons.map(option => (
            <button
              key={option.type}
              type="button"
              disabled={loading}
              className={`
                px-3 py-1 rounded-lg font-semibold text-xs transition-all border
                ${
                  selectedType === option.type
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-primary border-primary hover:bg-primary/10'
                }
                `}
              onClick={() => handleTypeChange(option.type as SearchType)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="relative w-full flex">
          {/* {!!selectedType && (
            <div
              className={`border-r-2 border-primary bg-neutral-50 h-full flex justify-center items-center px-2 font-bold transition-all duration-300 ease-in-out rounded-lg
                ${
                  selectedType
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0'
                } ${styles.slideInFromRight}`}
              style={{
                transform: 'translateX(100%)',
                opacity: 0,
              }}
            >
              {selectedType === 'NOME'
                ? 'NOME'
                : selectedType === 'RAZAO_SOCIAL'
                ? 'RAZÃO SOCIAL'
                : selectedType}
            </div>
          )} */}

          <div className="flex flex-col relative w-full mb-5 md:mb-0">
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
            {errorMsg && (
              <p className="text-red-500 text-sm absolute top-12">{errorMsg}</p>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-2 flex-wrap w-full md:flex-row md:w-auto">
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
            <option value="" disabled>
              Pesquisar UF
            </option>
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
            className="bg-primary rounded-lg p-4 w-full flex justify-center items-center disabled:bg-primary md:w-15"
          >
            {loading ? (
              <span className="material-icons animate-spin text-2xl text-primary">
                autorenew
              </span>
            ) : (
              <span className="material-icons text-2xl">search</span>
            )}
          </PrimaryButton>
        </section>
      </div>
    </form>
  );
};

export default SearchForm;
