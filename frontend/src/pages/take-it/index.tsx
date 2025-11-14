import Table, { TableColumn } from '@/components/Table';
import PersonDetailsModal from '@/components/takeit/PersonDetailsModal';
import TakeitLayout from '@/layout/takeitLayout';
import styles from '@/styles/takeit.module.scss';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

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
    render: row => row.cpf ?? '-',
  },
  {
    label: 'Email',
    key: 'email',
    render: row => {
      if (Array.isArray(row.emails) && row.emails.length > 0) {
        return <span>{row.emails.map(email => email.email).join(', ')}</span>;
      }
      if (row.email) {
        return row.email;
      }
      return '-';
    },
  },
  {
    label: 'Endereço',
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
    label: 'CEP',
    key: 'cep',
    render: row => row.cep ?? '-',
  },
];

const columnsCompany: TableColumn<CompanyResult>[] = [
  {
    label: 'Razão Social',
    key: 'razaoSocial',
    render: row => row.razaoSocial ?? '-',
  },
  {
    label: 'CNPJ',
    key: 'cnpj',
    render: row => row.cnpj ?? '-',
  },
  {
    label: 'Email',
    key: 'email',
    render: row => row.email ?? '-',
  },
];

// Componente principal
const TakeItPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ResultItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSelectItem = (item: ResultItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <TakeitLayout>
      {({ results, loading, typeColumns }) => {
        // Decide as colunas de acordo com o tipo selecionado
        const columns =
          typeColumns === 'persons'
            ? (columnsPerson as TableColumn<ResultItem>[])
            : (columnsCompany as TableColumn<ResultItem>[]);

        // Permite clicar em linhas para ver detalhes
        const onRowClick = (row: ResultItem) => {
          setSelectedItem(row);
          let url = null;

          if (row?.cpf) {
            url = `/take-it/view-person/${row?.cpf}`;
          } else if (row?.cnpj) {
            url = `/take-it/view-company/${row?.cnpj}`;
          }

          if (!url) {
            setError('Erro ao acessar a url');
            return;
          }
          router.push(url);
        };

        return (
          <div className={`${styles.container} shadow-md`}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
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
        );
      }}
    </TakeitLayout>
  );
};

export default TakeItPage;
