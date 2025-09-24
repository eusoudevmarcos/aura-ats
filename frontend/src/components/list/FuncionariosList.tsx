import api from '@/axios';
import Card from '@/components/Card';
import { Pagination } from '@/type/pagination.type';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table, { TableColumn } from '../Table';

// Tipos para Pessoa e Empresa
interface Pessoa {
  nome?: string;
}

type FuncionarioApi = {
  id: string;
  email: string;
  password: string;
  tipoUsuario: string;
  funcionario: {
    id: string;
    setor?: string;
    cargo?: string;
    usuarioSistemaId?: string;
    pessoaId?: string | null;
    pessoa?: Pessoa | null;
  } | null;
  cliente: any; // não utilizado para funcionários
};

type FuncionarioTabela = {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: string;
  setor: string;
  cargo: string;
};

function normalizarTable(funcionarios: FuncionarioApi[]): FuncionarioTabela[] {
  return funcionarios.map((f: FuncionarioApi) => {
    let nome = '-';
    if (f.funcionario && f.funcionario.pessoa && f.funcionario.pessoa.nome) {
      nome = f.funcionario.pessoa.nome;
    }
    return {
      id: f.id,
      nome,
      email: f.email,
      tipoUsuario: f.tipoUsuario,
      setor: f.funcionario?.setor || '-',
      cargo: f.funcionario?.cargo || '-',
    };
  });
}

// Colunas da tabela
const columns: TableColumn<FuncionarioTabela>[] = [
  { label: 'Nome', key: 'nome' },
  { label: 'Email', key: 'email' },
  { label: 'Tipo Usuário', key: 'tipoUsuario' },
  { label: 'Setor', key: 'setor' },
  { label: 'Cargo', key: 'cargo' },
];

const FuncionariosList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [funcionarios, setFuncionarios] = useState<FuncionarioApi[]>([]);
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
        const response = await api.get<Pagination<FuncionarioApi[]>>(
          '/api/externalWithAuth/funcionario',
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
      f.nome.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.tipoUsuario.toLowerCase().includes(search.toLowerCase()) ||
      f.setor.toLowerCase().includes(search.toLowerCase()) ||
      f.cargo.toLowerCase().includes(search.toLowerCase())
  );

  const onRowClick = (row: FuncionarioTabela) => {
    router.push(`/funcionario/${row.id}`);
  };

  return (
    <Card classNameContainer="mt-6 px-6 py-2">
      <div className="flex justify-between items-center flex-wrap p-2">
        <h2 className="text-xl font-bold mb-4">Lista de Funcionários</h2>
        <input
          type="text"
          placeholder="Buscar funcionário..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-grow w-full max-w-[300px] px-3 py-2 rounded-lg border border-gray-200 outline-none"
        />
      </div>

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
