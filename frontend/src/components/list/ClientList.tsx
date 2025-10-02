// frontend/components/Clients/ClientList.tsx
import api from '@/axios';
import Card from '@/components/Card';
import { StatusClienteEnum } from '@/schemas/statusClienteEnum.schema';
import { Pagination } from '@/type/pagination.type';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';
import Modal from '../modal/Modal';
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
}

interface Search {
  cpf?: string;
  status?: string;
  razaoSocial?: string;
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
  }));
}

const ClientList: React.FC<{
  onlyProspects?: boolean;
}> = ({ onlyProspects }) => {
  const [search, setSearch] = useState<Search>({});
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const pageSize = 5;
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);

      try {
        const params: Record<string, any> = {
          page,
          pageSize,
        };

        if (onlyProspects) {
          params.status = 'PROSPECT';
        } else if (search.status) {
          params.status = search.status;
        }

        if (search.cpf) {
          params.cpf = search.cpf;
        }

        if (search.razaoSocial) {
          params.razaoSocial = search.razaoSocial;
        }

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
        setTotalPages(Math.max(1, Math.ceil(data.length / pageSize)));
      } catch (_) {
        setClientes([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, [search, onlyProspects, page, pageSize]);

  const dadosTabela = useMemo(() => normalizarTable(clientes), [clientes]);

  const dadosFiltrados = useMemo(() => {
    if (!search || (!search.cpf && !search.status)) {
      return dadosTabela;
    }
    return dadosTabela.filter((c: any) => {
      let match = true;
      if (search.cpf) {
        match =
          match &&
          String(c.cnpj).toLowerCase().includes(search.cpf?.toLowerCase());
      }
      if (search.status) {
        match =
          match &&
          String(c.status).toLowerCase().includes(search.status?.toLowerCase());
      }
      if (search.razaoSocial) {
        match =
          match &&
          String(c.status)
            .toLowerCase()
            .includes(search.razaoSocial?.toLowerCase());
      }
      return match;
    });
  }, [dadosTabela, search]);

  const columns: TableColumn<any>[] = [
    { label: 'razaoSocial', key: 'razaoSocial' },
    { label: 'Email', key: 'email' },
    { label: 'CNPJ', key: 'cnpj' },
    { label: 'Abertura', key: 'dataAbertura' },
    { label: 'Serviços', key: 'servicos' },
    { label: 'Status', key: 'status' },
  ];

  const onRowClick = (row: any) => {
    router.push(`/cliente/${row.id}`);
  };

  return (
    <Card classNameContainer="mt-6 px-6 py-2">
      <div className="flex justify-between itesm-center flex-wrap p-2">
        <h3 className="text-xl font-bold">Lista de Clientes</h3>

        <div className="flex gap-2">
          <PrimaryButton onClick={() => setFilter(!filter)}>
            FILTROS
          </PrimaryButton>

          <FormInput
            name="buscar"
            type="text"
            placeholder="Buscar CNPJ"
            value={search.cpf || ''}
            inputProps={{
              classNameContainer: 'w-full max-w-[300px]',
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(prev => ({
                ...prev,
                cpf: e.target.value || undefined,
              }))
            }
          />
        </div>
        <Modal
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
        </Modal>
      </div>

      <Table
        columns={columns}
        data={dadosFiltrados}
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

export default ClientList;
