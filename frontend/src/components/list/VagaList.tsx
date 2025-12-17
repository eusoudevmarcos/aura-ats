import { getVagas } from '@/axios/vaga.axios';
import Card from '@/components/Card';
import { VagaInput } from '@/schemas/vaga.schema';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import Table, { TableColumn } from '../Table';
import { FormInput } from '../input/FormInput';

export interface Localizacao {
  cidade: string;
  uf: string;
}

// Define columns for the table
const columns: TableColumn<VagaInput>[] = [
  { label: 'Título', key: 'titulo' },
  {
    label: 'Data Publicação',
    key: 'dataPublicacao',
    render: row =>
      row.dataPublicacao
        ? new Date(row.dataPublicacao).toLocaleDateString('pt-BR')
        : 'N/A',
  },
  { label: 'Status', key: 'status' },
  { label: 'Categoria', key: 'categoria' },
  {
    label: 'Localização',
    key: 'localizacao.uf',
    render: row =>
      row.localizacao
        ? `${row.localizacao.cidade} - ${row.localizacao.uf}`
        : 'N/A',
  },
];

const PAGE_SIZE = 5;

interface VagaListProps {
  initialValues?: VagaInput[];
}

const VagaList: React.FC<VagaListProps> = ({ initialValues }) => {
  const [vagas, setVagas] = useState<VagaInput[]>(initialValues ?? []);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchVagas = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getVagas({
        search,
        page,
        pageSize,
      });
      setVagas(Array.isArray(result.data) ? result.data : []);
      setTotal(result.total ?? 0);
      setTotalPages(result.totalPages ?? 1);
    } catch (err) {
      setVagas([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, page, pageSize]);

  useEffect(() => {
    if (initialValues) return;
    fetchVagas();
  }, [fetchVagas]);

  const filtered = search
    ? vagas.filter(
        vaga =>
          vaga.titulo?.toLowerCase().includes(search.toLowerCase()) ||
          vaga.descricao?.toLowerCase().includes(search.toLowerCase()) ||
          vaga.localizacao?.cidade?.toLowerCase().includes(search.toLowerCase())
      )
    : vagas;

  const tableData = search ? filtered : vagas;

  return (
    <Card noShadow>
      <div className="flex justify-between items-center flex-wrap mb-2">
        <h2 className="text-2xl font-bold text-primary">Lista de Vagas</h2>
        <FormInput
          name="search"
          placeholder="Buscar por título, descrição ou cidade..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          clear
          inputProps={{
            className:
              'flex-grow w-full max-w-[400px] px-3 py-2 rounded-lg border border-gray-200 outline-none',
          }}
        />
      </div>
      <Table
        data={tableData}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhuma vaga encontrada."
        onRowClick={row => router.push(`/vaga/${row.id}`)}
        pagination={{
          page,
          pageSize,
          total,
          totalPages,
          onPageChange: (p: number) => setPage(p),
        }}
      />
    </Card>
  );
};

export default VagaList;
