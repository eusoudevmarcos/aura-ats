import api from '@/axios';
import ClientePage from '@/pages/cliente/[uuid]';
import { useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';

const ClienteSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [searchField, setSearchField] = useState('cnpj');
  const [initialValues, setInitialValues] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleSearch = async (event: any) => {
    event.preventDefault();
    console.log('aqui');
    console.log(event.target.value);
    if (!event.target.value || event.target.value === '') {
      return undefined;
    }
    setSearchQuery(event.target.value);
    setLoading(true);
    setError(null);
    setInitialValues(null);

    try {
      // Monta a query de acordo com o campo selecionado
      const params: any = {};
      params[searchField] = searchQuery;

      const response = await api.get('/api/external/cliente', {
        params: {
          page,
          pageSize,
          search: event.target.value,
        },
      });
      if (response.data.data) {
        setInitialValues(response.data.data[0]);
        setIsOpenModal(true);
      } else {
        setError('Cliente não encontrado.');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Erro ao buscar cliente. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <FormInput
          name="searchCliente"
          type="text"
          label="Pesquisar Cliente"
          value={searchQuery}
          onChange={handleSearch}
          placeholder={`Buscar por ${
            searchField === 'cnpj'
              ? 'CNPJ'
              : searchField === 'razaoSocial'
              ? 'Razão Social'
              : 'Nome Fantasia'
          }`}
        />

        <PrimaryButton
          type="submit"
          className="text-white font-semibold rounded !py-0"
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </PrimaryButton>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {initialValues && (
        // <Modal
        //   title="Informações do cliente"
        //   isOpen={isOpenModal}
        //   onClose={() => setIsOpenModal(!isOpenModal)}
        // >
        <ClientePage initialValues={initialValues}></ClientePage>
        // </Modal>
      )}
    </div>
  );
};

export default ClienteSearch;
