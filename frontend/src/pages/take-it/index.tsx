import Table, { TableColumn } from '@/components/Table';
import PersonDetailsModal from '@/components/takeit/PersonDetailsModal';
import TakeitLayout from '@/layout/takeitLayout';
import styles from '@/styles/takeit.module.scss';
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
    label: 'Nome',
    key: 'nome',
    render: row => row.nome ?? '-',
  },
  {
    label: 'CPF',
    key: 'cpf',
    render: row => row.cpf ?? '-',
  },
  {
    label: 'Email',
    key: 'email',
    render: row => row.email ?? '-',
  },
  {
    label: 'Endereço',
    key: 'endereco',
    render: row => row.endereco ?? '-',
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
        };

        return (
          <div className={`${styles.container} shadow-md`}>
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
