import api from '@/axios';
import ClientePage from '@/pages/cliente/[uuid]';
import { useEffect, useRef, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import Card from '../Card';
import { FormInput } from '../input/FormInput';
import Modal from '../modal/Modal';

const ClienteSearch = ({ onSuccess, initialValuesProps = null }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryList, setSearchQueryList] = useState<any[]>([]);
  const [page] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  console.log(initialValuesProps);
  const [searchField, setSearchField] = useState('cnpj');
  const [initialValues, setInitialValues] = useState<any>(
    initialValuesProps ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Dispara a busca automaticamente ao digitar (com debounce)
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchQueryList([]);
      setShowAutocomplete(false);
      return;
    }
    const delayDebounce = setTimeout(() => {
      if (searchQuery && searchQuery.trim() !== '') {
        handleSearch();
      } else {
        setInitialValues(null);
        setError(null);
        setSearchQueryList([]);
        setShowAutocomplete(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Fecha o autocomplete ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    }
    if (showAutocomplete) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAutocomplete]);

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.trim() === '') {
      setError('Digite um valor para pesquisar.');
      setInitialValues(null);
      setSearchQueryList([]);
      setShowAutocomplete(false);
      return;
    }
    setLoading(true);
    setError(null);
    setInitialValues(null);

    try {
      const params: any = {
        page,
        pageSize,
        search: {
          searchQuery,
        },
      };

      const response = await api.get('/api/external/cliente', {
        params,
      });

      if (response.data.data && response.data.data.length > 0) {
        setSearchQueryList(response.data.data);
        setShowAutocomplete(true);
      } else {
        setError('Cliente não encontrado.');
        setSearchQueryList([]);
        setShowAutocomplete(false);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Erro ao buscar cliente. Tente novamente.'
      );
      setSearchQueryList([]);
      setShowAutocomplete(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCliente = (cliente: any) => {
    setSearchQuery('');
    setShowAutocomplete(false);
    setSearchQueryList([]);
    setInitialValues(cliente);
    setError(null);
    onSuccess(cliente);
  };

  const BtnDelete = ({ className }: any) => {
    return (
      <PrimaryButton
        className={className}
        onClick={() => {
          setSearchQueryList([]);
          setInitialValues(null);
          setSearchQuery('');
        }}
      >
        <span className="material-icons-outlined">delete</span>
      </PrimaryButton>
    );
  };

  return (
    <div>
      <div className="flex flex-row gap-2 w-full">
        {/* <select
          className="border rounded px-2 py-1"
          value={searchField}
          onChange={e => setSearchField(e.target.value)}
        >
          <option value="cnpj">CNPJ</option>
          <option value="razaoSocial">Razão Social</option>
        </select> */}
        <div className="relative" ref={autocompleteRef}>
          <FormInput
            name="searchCliente"
            label="Pesquisar CNPJ do cliente"
            inputProps={{
              value: searchQuery,
            }}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowAutocomplete(true);
            }}
            placeholder={`Buscar por ${
              searchField === 'cnpj'
                ? 'CNPJ'
                : searchField === 'razaoSocial'
                ? 'Razão Social'
                : 'Nome Fantasia'
            }`}
          />
          {showAutocomplete && searchQueryList.length > 0 && (
            <div className="absolute top-14 left-0 w-[300px] max-h-60 overflow-y-auto bg-white z-50 shadow border rounded">
              {searchQueryList.map((e: any) => (
                <div
                  key={e.empresaId}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectCliente(e)}
                >
                  <div className="font-semibold">{e.empresa.razaoSocial}</div>
                  <div className="text-xs text-gray-500">{e.empresa.cnpj}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {loading && (
          <span className="text-gray-500 text-sm flex items-center">
            Buscando...
          </span>
        )}
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {initialValues && (
        <>
          <Card
            title="Dados do Cliente"
            classNameContent="flex justify-between"
          >
            <div className="flex flex-col justify-between">
              <p>
                CNPJ:
                <span className="text-secondary">
                  {initialValues.empresa.cnpj}
                </span>
              </p>
              <p>
                Razão Social:
                <span className="text-secondary">
                  {initialValues.empresa.razaoSocial}
                </span>
              </p>
            </div>
            <div className="flex gap-2 relative">
              <PrimaryButton onClick={() => setOpenModal(!openModal)}>
                Ver mais
              </PrimaryButton>
              <BtnDelete />
            </div>
          </Card>
          <Modal isOpen={openModal} onClose={() => setOpenModal(!openModal)}>
            <>
              <BtnDelete className="absolute right-14 top-3" />
              <ClientePage initialValues={initialValues}></ClientePage>
            </>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ClienteSearch;
