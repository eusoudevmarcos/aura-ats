import Card from '@/components/Card';
import useFetchWithPagination from '@/hook/useFetchWithPagination';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Table, { TableColumn } from '../Table';
import { FormInput } from '../input/FormInput';

// ===================== ENUMS (Adaptadas para o Frontend) =====================
export enum CategoriaVaga {
  TECNOLOGIA = 'TECNOLOGIA',
  SAUDE = 'SAUDE',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  FINANCEIRO = 'FINANCEIRO',
  RECURSOS_HUMANOS = 'RECURSOS_HUMANOS',
  MARKETING = 'MARKETING',
  VENDAS = 'VENDAS',
  OUTROS = 'OUTROS',
}

export enum StatusVaga {
  ATIVA = 'ATIVA',
  PAUSADA = 'PAUSADA',
  ENCERRADA = 'ENCERRADA',
  ARQUIVADA = 'ARQUIVADA',
}

export enum TipoContrato {
  CLT = 'CLT',
  PJ = 'PJ',
  ESTAGIO = 'ESTAGIO',
  FREELANCER = 'FREELANCER',
  TEMPORARIO = 'TEMPORARIO',
}

export enum NivelExperiencia {
  ESTAGIO = 'ESTAGIO',
  JUNIOR = 'JUNIOR',
  PLENO = 'PLENO',
  SENIOR = 'SENIOR',
  ESPECIALISTA = 'ESPECIALISTA',
  GERENTE = 'GERENTE',
}

export enum AreaCandidato {
  TI = 'TI',
  ENGENHARIA = 'ENGENHARIA',
  MEDICINA = 'MEDICINA',
  ADMINISTRACAO = 'ADMINISTRACAO',
  // ... outras áreas
}

// ===================== INTERFACES DE DADOS PARA O FRONTEND =====================
export interface Cliente {
  id: string;
  nome: string;
  // Adicione outros campos de Cliente que podem ser úteis no frontend
}

export interface Localizacao {
  id: string;
  cep: string;
  cidade: string;
  bairro: string;
  uf: string;
  estado?: string | null;
  logradouro?: string | null;
  // Adicione outros campos de Localizacao
}

export interface Beneficio {
  id: string;
  nome: string;
  descricao?: string | null;
}

export interface Habilidade {
  id: string;
  nome: string;
  tipoHabilidade?: string | null;
  // Não incluímos `vagas` aqui para evitar dependência circular
}

export interface VagaHabilidade {
  vagaId: string;
  habilidadeId: string;
  nivelExigido?: string | null;
  habilidade: Habilidade; // Incluindo a habilidade relacionada
}

export interface VagaWithRelations {
  id: string;
  titulo: string;
  descricao: string;
  requisitos?: string | null;
  responsabilidades?: string | null;
  salario?: number | null;
  tipoSalario?: string | null;
  dataPublicacao: string | Date;
  dataFechamento?: string | Date | null;
  create_at: string | Date;
  update_at: string | Date;

  categoria: CategoriaVaga;
  status: StatusVaga;
  tipoContrato: TipoContrato;
  nivelExperiencia: NivelExperiencia;
  areaCandidato?: AreaCandidato | null;

  cliente?: Cliente | null;
  clienteId?: string | null;

  localizacao?: Localizacao | null;
  localizacaoId?: string | null;

  beneficios?: Beneficio[];
  habilidades?: VagaHabilidade[];
  // Candidatos, CandidaturaVaga, AgendaVaga, Anexos (se precisar, inclua também)
}

// ===================== COMPONENTE VagaList =====================
const columns: TableColumn<VagaWithRelations>[] = [
  { label: 'Título', key: 'titulo' },
  {
    label: 'Data Publicação',
    key: 'dataPublicacao',
    render: (value, row) =>
      row.dataPublicacao
        ? new Date(row.dataPublicacao).toLocaleDateString('pt-BR')
        : 'N/A',
  },
  { label: 'Status', key: 'status' },
  { label: 'Categoria', key: 'categoria' },
  {
    label: 'Localização',
    key: 'localizacao.uf',
    render: (_, row) =>
      row.localizacao
        ? `${row.localizacao.cidade} - ${row.localizacao.uf}`
        : 'N/A',
  },
];

const VagaList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const {
    data: vagas,
    total: totalRecords,
    totalPages,
    loading: isLoading,
    setPage,
    setPageSize,
    page,
    pageSize,
  } = useFetchWithPagination<VagaWithRelations>(
    '/api/externalWithAuth/vaga',
    { search: searchQuery },
    {
      pageSize: 5,
      page: 1,
      dependencies: [searchQuery],
      requestOptions: {},
    }
  );

  // A filtragem local é mantida caso o backend não suporte 'search'
  // mas o ideal é que o 'search' seja tratado pelo backend na API.
  const filteredVagas = vagas.filter(
    vaga =>
      vaga.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaga.descricao?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaga.areaCandidato?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaga.localizacao?.cidade
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (row: VagaWithRelations) => {
    router.push(`/vaga/${row.id}`);
  };

  return (
    <Card classNameContainer="mt-6 px-6 py-2">
      <div className="flex justify-between items-center flex-wrap p-2">
        <h2 className="text-xl font-bold mb-4">Lista de Vagas</h2>
        <FormInput
          name="search"
          placeholder="Buscar por título, descrição, área ou cliente..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          clear
          inputProps={{
            className:
              'flex-grow w-full max-w-[400px] px-3 py-2 rounded-lg border border-gray-200 outline-none',
          }}
        />
      </div>
      <Table
        data={searchQuery ? filteredVagas : vagas}
        columns={columns}
        loading={isLoading}
        emptyMessage="Nenhuma vaga encontrada."
        onRowClick={handleRowClick}
        pagination={{
          page,
          pageSize,
          total: totalRecords,
          totalPages: totalPages,
          onPageChange: (p: number) => setPage(p),
        }}
      />
    </Card>
  );
};

export default VagaList;
