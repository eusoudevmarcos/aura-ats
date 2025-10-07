import api from '@/axios';
import Card from '@/components/Card';
import { ContatoInput } from '@/schemas/contato.schema';
import { LocalizacaoInput } from '@/schemas/localizacao.schema';
import { Candidato } from '@/type/candidato.type';
import { Especialidade } from '@/type/especialidade.type';
import { Pessoa } from '@/type/pessoa.type';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table, { TableColumn } from '../Table'; // Certifique-se que o caminho está correto

export type CandidatoWithRelations = Candidato & {
  pessoa: Pessoa & {
    contatos?: ContatoInput[];
    localizacoes?: LocalizacaoInput[];
  };
  especialidade?: Especialidade | null;
};

const columns: TableColumn<CandidatoWithRelations>[] = [
  {
    label: 'Nome',
    key: 'pessoa.nome',
    render: row => row.pessoa?.nome || '-',
  },

  { label: 'Área Candidato', key: 'areaCandidato' },
  {
    label: 'Especialidade',
    key: 'especialidade.nome',
    render: row => row.especialidade?.nome || '-',
  },
  { label: 'RQE', key: 'rqe' },

  {
    label: 'UF/Cidade',
    key: 'pessoa.localizacoes',
    render: (row, i) => {
      if (
        row.pessoa?.localizacoes?.[0]?.cidade ||
        row.pessoa?.localizacoes?.[0]?.uf
      ) {
        return (
          row.pessoa?.localizacoes?.[0]?.cidade +
          '-' +
          row.pessoa?.localizacoes?.[0]?.uf
        );
      }
      return '-';
    },
  },
];

const CandidatoList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [candidatos, setCandidatos] = useState<CandidatoWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    const fetchCandidatos = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/externalWithAuth/candidato', {
          params: {
            page,
            pageSize,
            search,
          },
        });
        setCandidatos(response.data.data);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log('Erro ao buscar candidatos:', error);
        setCandidatos([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatos();
  }, [page, pageSize, search]);

  const dadosTabela = candidatos;

  const dadosFiltrados = dadosTabela.filter(
    c =>
      c.pessoa?.nome?.toLowerCase().includes(search.toLowerCase()) ||
      c.areaCandidato?.toLowerCase().includes(search.toLowerCase()) ||
      c.pessoa?.cpf?.toLowerCase().includes(search.toLowerCase()) ||
      c.especialidade?.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.pessoa?.localizacoes?.[0]?.uf
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      c.pessoa?.localizacoes?.[0]?.cidade
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const onRowClick = (row: CandidatoWithRelations) => {
    router.push(`/candidato/${row.id}`);
  };

  return (
    <Card classNameContainer="px-6 py-2">
      <div className="flex justify-between flex-wrap p-2 items-center mb-4">
        <h2 className="text-xl font-bold">Lista de Profissionais</h2>

        <input
          type="text"
          placeholder="Buscar por nome, email, área ou CPF..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full max-w-md"
        />
      </div>
      <Table
        data={search ? dadosFiltrados : dadosTabela}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum candidato encontrado."
        onRowClick={onRowClick}
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

export default CandidatoList;
