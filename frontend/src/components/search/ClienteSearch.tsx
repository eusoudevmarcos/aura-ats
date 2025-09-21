import api from '@/axios';
import AutocompletePopover from '@/components/utils/AutocompletePopover';
import ClientePage from '@/pages/cliente/[uuid]';
import { useEffect, useRef, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import Card from '../Card';
import { FormInput } from '../input/FormInput';
import Modal from '../modal/Modal';

const ClienteSearch = ({
  onSuccess,
  onDelete = null,
  initialValuesProps = null,
  preview = true,
  showInput = true,
}: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryList, setSearchQueryList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  console.log(initialValuesProps);
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
        // reinicia paginação ao novo termo
        setPage(1);
        handleSearch(false);
      } else {
        setInitialValues(null);
        setError(null);
        setSearchQueryList([]);
        setShowAutocomplete(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Paginação incremental ao chegar no fim do scroll
  useEffect(() => {
    if (page > 1 && searchQuery.length >= 3) {
      handleSearch(true);
    }
  }, [page]);

  const handleSearch = async (append: boolean) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setError('Digite um valor para pesquisar.');
      setInitialValues(null);
      setSearchQueryList([]);
      setShowAutocomplete(false);
      return;
    }
    setLoading(true);
    setError(null);
    if (!append) setInitialValues(null);

    try {
      const params: any = {
        page,
        pageSize,
        search: {
          searchQuery,
        },
      };

      const response = await api.get('/api/externalWithAuth/cliente', {
        params,
      });

      const data = response.data.data ?? [];
      if (data.length > 0) {
        setSearchQueryList(prev => (append ? [...prev, ...data] : data));
        setShowAutocomplete(true);
      } else if (!append) {
        setError('Cliente não encontrado.');
        setSearchQueryList([]);
        setShowAutocomplete(false);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Erro ao buscar cliente. Tente novamente.'
      );
      if (!append) {
        setSearchQueryList([]);
        setShowAutocomplete(false);
      }
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
          if (onDelete) onDelete();
        }}
      >
        <span className="material-icons-outlined">delete</span>
      </PrimaryButton>
    );
  };

  return (
    <>
      {showInput && (
        <div className="flex flex-row gap-2 w-full">
          <div className="relative w-full" ref={autocompleteRef}>
            <p className="my-2 font-bold">Pesquisa de cliente</p>
            <FormInput
              name="searchCliente"
              inputProps={{
                value: searchQuery,
                classNameContainer: 'w-full',
              }}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowAutocomplete(true);
              }}
              placeholder={`Buscar por CNPJ`}
            />

            <AutocompletePopover
              anchorRef={autocompleteRef as any}
              isOpen={showAutocomplete && searchQueryList.length > 0}
              onRequestClose={() => setShowAutocomplete(false)}
              searchMore={() => setPage(prev => prev + 1)}
              classNameContainer="rounded shadow-md border"
              classNameContent="max-h-60"
            >
              {searchQueryList.map((e: any) => (
                <div
                  key={e.empresaId}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200 border-b"
                  onClick={() => handleSelectCliente(e)}
                >
                  <div className="font-semibold">{e.empresa.razaoSocial}</div>
                  <div className="text-xs text-gray-500">{e.empresa.cnpj}</div>
                </div>
              ))}
            </AutocompletePopover>
          </div>
          {loading && (
            <span className="text-gray-500 text-sm flex items-center">
              Buscando...
            </span>
          )}
        </div>
      )}

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {initialValues && (
        <>
          <Card
            title={preview && 'Dados do Cliente'}
            classNameContent="flex justify-between"
          >
            {preview && (
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
            )}
            <div className="flex gap-2 relative">
              <PrimaryButton onClick={() => setOpenModal(!openModal)}>
                Ver Cliente
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
    </>
  );
};

export default ClienteSearch;
