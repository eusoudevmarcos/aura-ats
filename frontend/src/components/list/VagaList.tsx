import { getVagas } from '@/axios/vaga.axios';
import Card from '@/components/Card';
import {
  CategoriaVagaEnum,
  StatusVagaEnum,
  VagaInput,
} from '@/schemas/vaga.schema';
import { UF_MODEL } from '@/utils/UF';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  { label: 'Andamento da Vaga', key: 'status' },
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
  loadingProp?: boolean;
}

const VagaList: React.FC<VagaListProps> = ({ initialValues }) => {
  const [vagas, setVagas] = useState<VagaInput[]>(initialValues ?? []);
  const [loading, setLoading] = useState(false);

  // Valores que estão sendo digitados/selecionados nos inputs (mas ainda não pesquisados)
  const [tituloInput, setTituloInput] = useState('');
  const [statusInput, setStatusInput] = useState('');
  const [categoriaInput, setCategoriaInput] = useState('');
  const [ufInput, setUfInput] = useState('');
  const [cidadeInput, setCidadeInput] = useState('');
  const [categoriaQuery, setCategoriaQuery] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { uuid } = router.query;

  // Função para realizar a pesquisa só ao clicar no botão
  const handleSearch = () => {
    fetchVagas();
    setPage(1);
  };

  const handleClear = async () => {
    setTituloInput('');
    setStatusInput('');
    setCategoriaInput('');
    setUfInput('');
    await fetchVagas();
    setPage(1);
  };

  const fetchVagas = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...(tituloInput ? { titulo: tituloInput } : {}),
        ...(statusInput ? { status: statusInput } : {}),
        ...(categoriaQuery ? { categoria: categoriaQuery } : {}),
        ...(ufInput ? { uf: ufInput } : {}),
        ...(cidadeInput ? { cidade: cidadeInput } : {}),
        ...(uuid ? { clienteId: uuid } : {}),
        page,
        pageSize,
      };
      const result = await getVagas(params);
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
  }, [tituloInput, statusInput, categoriaQuery, ufInput, cidadeInput, uuid, page, pageSize]);

  useEffect(() => {
    if (initialValues) return;
    fetchVagas();
  }, [initialValues, fetchVagas]);

  const tableData = useMemo(() => vagas, [vagas]);

  return (
    <Card noShadow>
      <div className="flex justify-end items-end flex-wrap mb-2 gap-2">
        <FormInput
          name="Titulo"
          label="Titulo"
          placeholder="Buscar por título"
          value={tituloInput}
          onChange={e => setTituloInput(e.target.value)}
          clear
          inputProps={{
            disabled: loading,
            classNameContainer: 'w-full md:w-auto',
          }}
        />

        <FormSelect
          name="Status"
          label="Andamento da vaga"
          value={statusInput}
          onChange={e => setStatusInput(e.target.value)}
          selectProps={{
            disabled: loading,
            classNameContainer: 'w-full md:w-auto',
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
            disabled: loading,
            classNameContainer: 'w-full md:w-auto',
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

        <FormSelect
          name=""
          label="UF"
          value={ufInput}
          onChange={e => setUfInput(e.target.value)}
          selectProps={{
            disabled: loading,
            classNameContainer: 'w-full md:w-auto',
          }}
          placeholder="TODOS"
          placeholderDisable={false}
        >
          {UF_MODEL.map(uf => (
            <option key={uf.value} value={uf.value}>
              {uf.label}
            </option>
          ))}
        </FormSelect>

        <PrimaryButton
          className="w-full md:w-auto"
          onClick={handleSearch}
          disabled={loading}
        >
          <span className="md:hidden text-sm!">Pesquisar</span>
          <span className="material-icons-outlined text-sm!">search</span>
        </PrimaryButton>

        <PrimaryButton
          variant="negative"
          onClick={handleClear}
          disabled={!tituloInput && !statusInput && !ufInput && !categoriaInput}
        >
          <span className="material-icons-outlined text-sm!">delete</span>
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
