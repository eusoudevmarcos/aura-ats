// frontend/components/Agenda/AgendaList.tsx
import api from '@/axios';
import Card from '@/components/Card';
import { Pagination } from '@/type/pagination.type';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import Table, { TableColumn } from '../Table';

interface Localizacao {
  cidade?: string;
  uf?: string;
  logradouro?: string;
}

interface EtapaAtual {
  nome: string;
  tipo: string;
}

interface AgendaVaga {
  id: string;
  dataHora: string;
  link?: string;
  tipoEvento: string;
  localizacao?: Localizacao;
  vagaId?: string;
  etapaAtual?: EtapaAtual;
}

function normalizarTable(agendas: AgendaVaga[]) {
  return agendas.map(a => ({
    id: a.id,
    dataHora: a.dataHora ? new Date(a.dataHora).toLocaleString('pt-BR') : '-',
    tipoEvento: a.tipoEvento,
    link: a.link ?? '-',
    localizacao: a.localizacao
      ? `${a.localizacao.logradouro ?? '-'}, ${a.localizacao.cidade ?? '-'} - ${
          a.localizacao.uf ?? '-'
        }`
      : '-',
    etapa: a.etapaAtual?.nome ?? '-',
    tipoEtapa: a.etapaAtual?.tipo ?? '-',
  }));
}

const AgendaList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [agendas, setAgendas] = useState<AgendaVaga[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Paginação
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    const fetchAgendas = async () => {
      setLoading(true);
      try {
        const response = await api.get<Pagination<AgendaVaga[]>>(
          '/api/external/agenda'
        );
        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        setAgendas(data);
        setTotal(data.length);
        setTotalPages(Math.max(1, Math.ceil(data.length / pageSize)));
      } catch (_) {
        setAgendas([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchAgendas();
  }, []);

  const dadosTabela = useMemo(() => normalizarTable(agendas), [agendas]);

  const dadosFiltrados = useMemo(() => {
    const s = search.toLowerCase();
    return dadosTabela.filter((a: any) =>
      [a.dataHora, a.tipoEvento, a.link, a.localizacao, a.etapa, a.tipoEtapa]
        .filter(Boolean)
        .some((v: string) => String(v).toLowerCase().includes(s))
    );
  }, [dadosTabela, search]);

  const columns: TableColumn<any>[] = [
    { label: 'Data e Hora', key: 'dataHora' },
    { label: 'Tipo de Evento', key: 'tipoEvento' },
    { label: 'Link', key: 'link' },
    { label: 'Localização', key: 'localizacao' },
    { label: 'Etapa', key: 'etapa' },
    { label: 'Tipo Etapa', key: 'tipoEtapa' },
  ];

  const onRowClick = (row: any) => {
    router.push(`/agenda/${row.id}`);
  };

  return (
    <Card classNameContainer="mt-6 px-6 py-2">
      <div className="flex justify-between items-center flex-wrap p-2">
        <h3 className="text-xl font-bold mb-4">Lista de Agendas</h3>
        <input
          type="text"
          placeholder="Buscar agenda..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-grow w-full max-w-[300px] px-3 py-2 rounded-lg border border-gray-200 outline-none"
        />
      </div>
      <Table
        columns={columns}
        data={dadosFiltrados}
        loading={loading}
        emptyMessage="Nenhuma agenda encontrada."
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

export default AgendaList;
