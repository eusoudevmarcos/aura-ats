import api from '@/axios';
import Card from '@/components/Card';
import { AreaCandidatoEnum } from '@/schemas/candidato.schema';
import { ContatoInput } from '@/schemas/contato.schema';
import { LocalizacaoInput } from '@/schemas/localizacao.schema';
import { Candidato } from '@/type/candidato.type';
import { Especialidade } from '@/type/especialidade.type';
import { Pessoa } from '@/type/pessoa.type';
import { UF_MODEL } from '@/utils/UF';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import Table, { TableColumn } from '../Table';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

export type CandidatoWithRelations = Candidato & {
  pessoa: Pessoa & {
    contatos?: ContatoInput[];
    localizacoes?: LocalizacaoInput[];
  };
  medico: {
    rqe: string;
    crm: [];
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
  {
    label: 'RQE',
    key: 'rqe',
    render: row => row.medico?.rqe || '-',
  },
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
  // States de input dos filtros (digitados/selecionados, não pesquisados ainda)
  const [searchNomeRqeInput, setSearchNomeRqeInput] = useState('');
  const [searchAreaInput, setSearchAreaInput] = useState('');
  const [searchUfInput, setSearchUfInput] = useState('');

  // States de busca real (só atualiza ao clicar no botão)
  const [searchNomeRqe, setSearchNomeRqe] = useState('');
  const [searchArea, setSearchArea] = useState('');
  const [searchUf, setSearchUf] = useState('');
  const [searchClicked, setSearchClicked] = useState<boolean>(false);

  const [candidatos, setCandidatos] = useState<CandidatoWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  // Atualiza filtros reais ao clicar no botão de pesquisa
  const handleSearch = () => {
    setSearchNomeRqe(searchNomeRqeInput);
    setSearchArea(searchAreaInput);
    setSearchUf(searchUfInput);
    setPage(1); // Sempre volta pra primeira página ao pesquisar
    setSearchClicked(true);
  };

  // Limpar filtros e busca
  const handleClear = async () => {
    setSearchNomeRqeInput('');
    setSearchAreaInput('');
    setSearchUfInput('');
    setSearchNomeRqe('');
    setSearchArea('');
    setSearchUf('');
    setSearchClicked(false);
    setPage(1);
  };

  useEffect(() => {
    const fetchCandidatos = async () => {
      setLoading(true);
      try {
        // Monta os filtros apenas se preenchidos
        const params: any = {
          page,
          pageSize,
        };
        if (searchNomeRqe) params.search = searchNomeRqe;
        if (searchArea) params.areaCandidato = searchArea;
        if (searchUf) params.uf = searchUf;

        const response = await api.get('/api/externalWithAuth/candidato', {
          params,
        });

        setCandidatos(response.data.data ?? []);
        setTotal(response.data.total ?? 0);
        setTotalPages(response.data.totalPages ?? 1);
      } catch (error) {
        console.log('Erro ao buscar candidatos:', error);
        setCandidatos([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    // Busca inicial só quando não clicou pesquisar, se não houver candidatos carregados
    if (!searchClicked && candidatos.length === 0) {
      fetchCandidatos();
    }
  }, [pageSize]);

  useEffect(() => {
    // Busca ao clicar pesquisar ou mudar de página/filtro
    const fetchCandidatos = async () => {
      setLoading(true);
      try {
        const params: any = {
          page,
          pageSize,
        };
        if (searchNomeRqe) params.search = searchNomeRqe;
        if (searchArea) params.areaCandidato = searchArea;
        if (searchUf) params.uf = searchUf;

        const response = await api.get('/api/externalWithAuth/candidato', {
          params,
        });

        setCandidatos(response.data.data ?? []);
        setTotal(response.data.total ?? 0);
        setTotalPages(response.data.totalPages ?? 1);
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
  }, [page, searchNomeRqe, searchArea, searchUf]);

  // Filtro adicional *cliente-side* (apenas se searchNomeRqe preenchido)
  const dadosFiltrados = useMemo(() => {
    return searchNomeRqe
      ? candidatos.filter(
          c =>
            c.pessoa?.nome
              ?.toLowerCase()
              .includes(searchNomeRqe.toLowerCase()) ||
            c.areaCandidato
              ?.toLowerCase()
              .includes(searchNomeRqe.toLowerCase()) ||
            c.pessoa?.cpf
              ?.toLowerCase()
              .includes(searchNomeRqe.toLowerCase()) ||
            c.medico?.rqe
              ?.toLowerCase()
              .includes(searchNomeRqe.toLowerCase()) ||
            c.especialidade?.nome
              ?.toLowerCase()
              .includes(searchNomeRqe.toLowerCase()) ||
            c.pessoa?.localizacoes?.[0]?.uf
              ?.toLowerCase()
              .includes(searchNomeRqe.toLowerCase()) ||
            c.pessoa?.localizacoes?.[0]?.cidade
              ?.toLowerCase()
              .includes(searchNomeRqe.toLowerCase())
        )
      : candidatos;
  }, [candidatos, searchNomeRqe]);

  const filtroTemValor = !!(
    searchNomeRqeInput.trim() ||
    searchAreaInput.trim() ||
    searchUfInput.trim()
  );

  const onRowClick = (row: CandidatoWithRelations) => {
    router.push(`/candidato/${row.id}`);
  };

  return (
    <>
      <Card>
        <h2 className="text-2xl font-bold text-primary">
          Lista de Profissionais
        </h2>
        <div className="flex justify-end items-end flex-wrap mb-2 gap-2">
          <FormInput
            name=""
            type="text"
            label="Nome ou RQE"
            placeholder="Pesquisar"
            value={searchNomeRqeInput}
            onChange={e => setSearchNomeRqeInput(e.target.value)}
            inputProps={{
              disabled: loading,
            }}
          />

          <FormSelect
            name=""
            label="Área Candidato"
            value={searchAreaInput}
            onChange={e => setSearchAreaInput(e.target.value)}
            selectProps={{
              disabled: loading,
            }}
            placeholder="TODOS"
            placeholderDisable={false}
          >
            {AreaCandidatoEnum.options.map(area => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            name=""
            label="UF"
            value={searchUfInput}
            onChange={e => setSearchUfInput(e.target.value)}
            selectProps={{
              disabled: loading,
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
            onClick={handleSearch}
            disabled={!filtroTemValor || loading}
          >
            <span className="material-icons-outlined">search</span>
          </PrimaryButton>

          <PrimaryButton
            variant="negative"
            onClick={handleClear}
            disabled={!filtroTemValor}
          >
            <span className="material-icons-outlined">delete</span>
          </PrimaryButton>
        </div>
        <Table
          data={dadosFiltrados}
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
    </>
  );
};

export default CandidatoList;
