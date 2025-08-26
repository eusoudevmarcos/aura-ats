import api from '@/axios';
import { Pagination } from '@/type/pagination.type';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Card from '../card';
import Table, { TableColumn } from '../Table';

// Tipos para Pessoa e Empresa
interface Contato {
  telefone?: string;
  whatsapp?: string;
  email?: string;
}

interface Pessoa {
  nome: string;
  cpf: string;
  dataNascimento: string;
  estadoCivil?: string;
  rg?: number;
  contatos: Contato[];
}

interface Empresa {
  razaoSocial: string;
  cnpj: string;
  dataAbertura: string;
  contatos: Contato[];
  localizacoes?: { cidade: string; estado: string }[];
}

type Funcionario = {
  id?: string;
  pessoa?: Pessoa;
  empresa?: Empresa;
  email: string;
  password: string;
  tipoUsuario: string;
  setor?: string;
  cargo?: string;
};

type FuncionarioTabela = {
  nome?: string;
  email?: string;
  tipoUsuario: string;
  dataNascimento: string;
};

function normalizarTable(funcionarios: Funcionario[]): FuncionarioTabela[] {
  return funcionarios.map(f => {
    if ('pessoa' in f) {
      return {
        nome: f.pessoa?.nome,
        email: f.pessoa?.contatos?.[0]?.email || f.email,
        tipoUsuario: f.tipoUsuario,
        dataNascimento: f.pessoa?.dataNascimento
          ? new Date(f.pessoa?.dataNascimento).toLocaleDateString('pt-BR')
          : '-',
        id: f.id,
      };
    } else if ('empresa' in f) {
      return {
        nome: f.empresa?.razaoSocial,
        email: f.empresa?.contatos?.[0]?.email || f.email,
        tipoUsuario: f.tipoUsuario,
        dataNascimento: f.empresa?.dataAbertura
          ? new Date(f.empresa?.dataAbertura).toLocaleDateString('pt-BR')
          : '-',
        id: f.id,
      };
    }
    return {
      nome: '-',
      email: '-',
      tipoUsuario: '-',
      dataNascimento: '-',
    };
  });
}

// Colunas da tabela
const columns: TableColumn<FuncionarioTabela>[] = [
  { label: 'Nome', key: 'nome' },
  { label: 'Email', key: 'email' },
  { label: 'Tipo Usuário', key: 'tipoUsuario' },
  { label: 'Data de Nascimento', key: 'dataNascimento' },
];

const FuncionariosList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Estados para paginação
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    const fetchFuncionarios = async () => {
      setLoading(true);
      try {
        const response = await api.get<Pagination<Funcionario[]>>(
          '/api/external/funcionario',
          {
            params: {
              page,
              pageSize,
            },
          }
        );
        setFuncionarios(response.data.data);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } catch (_) {
        setFuncionarios([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, [page, pageSize]);

  const dadosTabela = normalizarTable(funcionarios);

  const dadosFiltrados = dadosTabela.filter(
    f =>
      f.nome?.toLowerCase().includes(search.toLowerCase()) ||
      f.email?.toLowerCase().includes(search.toLowerCase()) ||
      f.tipoUsuario.toLowerCase().includes(search.toLowerCase())
  );

  const onRowClick = (row: any) => {
    router.push(`/funcionario/${row.id}`);
  };

  return (
    <Card classNameContainer="mt-6 px-6 py-8">
      <div className="flex justify-between p-2">
        <h2 className="text-xl font-bold mb-4">Lista de Candidatos</h2>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-grow w-full max-w-[300px] px-3 py-2 rounded-lg border border-gray-200 outline-none"
        />
      </div>
      <input
        type="text"
        placeholder="Buscar por nome, email ou tipo de usuário..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <Table
        data={search ? dadosFiltrados : dadosTabela}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum funcionário encontrado."
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

export default FuncionariosList;
