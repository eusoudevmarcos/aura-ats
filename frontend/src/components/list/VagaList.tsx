import { getVagas } from '@/axios/vaga.axios';
import Card from '@/components/Card';
import {
  CategoriaVagaEnum,
  StatusVagaEnum,
  VagaInput,
} from '@/schemas/vaga.schema';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import Table, { TableColumn } from '../Table';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

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

  // Valores que estão sendo digitados/selecionados nos inputs (mas ainda não pesquisados)
  const [searchInput, setSearchInput] = useState('');
  const [statusInput, setStatusInput] = useState('');
  const [categoriaInput, setCategoriaInput] = useState('');

  // Valores efetivamente utilizados na consulta (validados ao clicar no botão)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [categoriaQuery, setCategoriaQuery] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // Função para realizar a pesquisa só ao clicar no botão
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setStatusQuery(statusInput);
    setCategoriaQuery(categoriaInput);
    setPage(1);
  };

  // Buscar só quando searchQuery/statusQuery/categoriaQuery/paginar alterar (inputs NÃO fazem fetch)
  const fetchVagas = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getVagas({
        search: searchQuery || '',
        // status/categoria só enviados se preenchidos
        ...(statusQuery ? { status: statusQuery } : {}),
        ...(categoriaQuery ? { categoria: categoriaQuery } : {}),
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
    // eslint-disable-next-line
  }, [searchQuery, statusQuery, categoriaQuery, page, pageSize]);

  useEffect(() => {
    if (initialValues) return;
    fetchVagas();
    // eslint-disable-next-line
  }, [searchQuery, statusQuery, categoriaQuery, page, pageSize]);

  // Aplicar filtro apenas se searchQuery (clique no botão)
  const filtered = searchQuery
    ? vagas.filter(
        vaga =>
          vaga.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vaga.descricao?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vaga.localizacao?.cidade
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : vagas;

  const tableData = searchQuery ? filtered : vagas;

  return (
    <Card noShadow>
      <h2 className="text-2xl font-bold text-primary">Lista de Vagas</h2>
      <div className="flex justify-end items-end flex-wrap mb-2 gap-2">
        <FormInput
          name="Titulo"
          label="Titulo"
          placeholder="Buscar por título, descrição ou cidade..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          clear
          inputProps={{
            className:
              'flex-grow w-full max-w-[400px] px-3 py-2 rounded-lg border border-gray-200 outline-none',
            disabled: loading,
          }}
        />

        <FormSelect
          name="Status"
          label="Status"
          value={statusInput}
          onChange={e => setStatusInput(e.target.value)}
          selectProps={{
            className: 'p-2 border border-gray-300 rounded',
            disabled: loading,
          }}
          placeholder="TODOS"
          placeholderDisable={false}
        >
          {StatusVagaEnum.options.map(area => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </FormSelect>

        <FormSelect
          name="Categoria"
          label="Categoria"
          value={categoriaInput}
          onChange={e => setCategoriaInput(e.target.value)}
          selectProps={{
            className: 'p-2 border border-gray-300 rounded',
            disabled: loading,
          }}
          placeholder="TODOS"
          placeholderDisable={false}
        >
          {CategoriaVagaEnum.options.map(area => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </FormSelect>

        <PrimaryButton
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <span className="material-icons-outlined">search</span>
        </PrimaryButton>
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
