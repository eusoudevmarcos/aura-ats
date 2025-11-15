// frontend/components/Clients/ClientList.tsx
import api from '@/axios';
import Card from '@/components/Card';
import { useAdmin } from '@/context/AuthContext';
import { Pagination } from '@/type/pagination.type';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import Table, { TableColumn } from '../Table';

interface EmpresaContato {
  telefone?: string;
  whatsapp?: string;
}
interface EmpresaLocalizacao {
  cidade: string;
  estado: string;
}
interface Empresa {
  id: string;
  razaoSocial: string;
  cnpj: string;
  dataAbertura?: string;
  contatos?: EmpresaContato[];
  localizacoes?: EmpresaLocalizacao[];
}
interface Cliente {
  id: string;
  tipoServico: string[];
  empresa: Empresa;
  status: string;
  usuarioSistema: {
    email: string;
  };
  vagas: {
    agendaVaga: number;
    triagens: number;
    beneficios: number;
    anexos: number;
    habilidades: number;
    candidaturas: number;
  }[];
}

function normalizarTable(clientes: Cliente[]) {
  return clientes.map(c => ({
    id: c.id,
    razaoSocial: c.empresa?.razaoSocial ?? '-',
    email: c.usuarioSistema?.email ?? '-',
    cnpj: c.empresa?.cnpj ?? '-',
    dataAbertura: c.empresa?.dataAbertura
      ? new Date(c.empresa.dataAbertura).toLocaleDateString('pt-BR')
      : '-',
    servicos: Array.isArray(c.tipoServico)
      ? c.tipoServico.join(', ')
      : String(c.tipoServico ?? '-'),
    status: c.status,
    vagasCount: c.vagas.length,
  }));
}

const ClienteList: React.FC<{
  onlyProspects?: boolean;
}> = ({ onlyProspects }) => {
  const [search, setSearch] = useState<string>('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const pageSize = 5;
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();
  const isAdmin = useAdmin();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchClientes = async () => {
      setLoading(true);

      try {
        const params: Record<string, any> = {
          page,
          pageSize,
          search,
        };

        const response = await api.get<Pagination<Cliente[]>>(
          '/api/externalWithAuth/cliente',
          {
            params,
          }
        );

        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        setClientes(data);
        setTotal(data.length);
        setTotalPages(response.data.totalPages);
      } catch (_) {
        setClientes([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    // Debounce de 400ms na pesquisa/search
    timeoutId = setTimeout(() => {
      fetchClientes();
    }, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search, onlyProspects, page, pageSize]);

  const dadosTabela = useMemo(() => normalizarTable(clientes), [clientes]);

  const columns: TableColumn<any>[] = [
    { label: 'razaoSocial', key: 'razaoSocial' },
    { label: 'Email acesso', key: 'email' },
    { label: 'CNPJ', key: 'cnpj' },
    { label: 'Abertura', key: 'dataAbertura' },

    { label: 'Status', key: 'status', hiddeBtnCopy: true },
  ];

  if (isAdmin) {
    columns.push(
      // { label: 'Serviços', hiddeBtnCopy: true, key: 'servicos' },
      {
        label: 'Vagas',
        key: 'vagasCount',
        hiddeBtnCopy: true,
      }
    );
  }

  const onRowClick = (row: any) => {
    router.push(`/cliente/${row.id}`);
  };

  return (
    <Card noShadow>
      <div className="flex justify-between itesm-center flex-wrap mb-2">
        <h3 className="text-2xl font-bold text-primary">Lista de Clientes</h3>

        <div className="flex gap-2 w-full  max-w-[500px]">
          <FormInput
            name="buscar"
            type="text"
            placeholder="Buscar CNPJ, Razão social e Nome Fantasia"
            value={search || ''}
            inputProps={{
              classNameContainer: 'w-full',
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
          <PrimaryButton onClick={() => setFilter(!filter)} disabled={!search}>
            <span className="material-icons-outlined">search</span>
          </PrimaryButton>
        </div>
        {/* <Modal
          isOpen={filter}
          title="FILTROS"
          onClose={() => setFilter(!filter)}
          backdropClose
        >
          <div className="flex gap-2">
            <FormInput
              label="Razão Social"
              name="razaoSocial"
              type="text"
              placeholder="Buscar Razão Social"
              value={search.razaoSocial || ''}
              inputProps={{
                classNameContainer: 'w-full max-w-[300px]',
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(prev => ({
                  ...prev,
                  razaoSocial: e.target.value || undefined,
                }))
              }
            />

            <FormSelect
              label="Filtrar Status"
              name="status"
              placeholder="TUDO"
              onChange={e =>
                setSearch(prev => ({
                  ...prev,
                  status: e.target.value || undefined,
                }))
              }
              selectProps={{
                classNameContainer: 'max-w-[300px] w-full',
                value: search.status || '',
              }}
            >
              <>
                {StatusClienteEnum.options.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </>
            </FormSelect>
          </div>
        </Modal> */}
      </div>

      <Table
        columns={columns}
        data={dadosTabela}
        loading={loading}
        emptyMessage="Nenhum cliente encontrado."
        pagination={{
          page,
          pageSize,
          total,
          totalPages,
          onPageChange: setPage,
        }}
        onRowClick={onRowClick}
      />
    </Card>
  );
};

export default ClienteList;
