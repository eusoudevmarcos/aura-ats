import {
  criarEspecialidade,
  Especialidade,
  EspecialidadeCreate,
  listarEspecialidades,
  removerEspecialidade,
} from '@/axios/especilidade.axios';
import { PrimaryButton } from '@/components/button/PrimaryButton';
import { FormInput } from '@/components/input/FormInput';
import Modal from '@/components/modal/Modal';
import Table, { TableColumn } from '@/components/Table';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const EspecialidadeList: React.FC = () => {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [searchApplied, setSearchApplied] = useState<string>('');

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<EspecialidadeCreate>();

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  const fetchEspecialidades = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarEspecialidades();
      setEspecialidades(data);
    } catch (e: any) {
      setError('Erro ao buscar especialidades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const especialidadesFiltradas = React.useMemo(() => {
    if (!searchApplied.trim()) return especialidades;
    return especialidades.filter(
      e =>
        e.nome.toLowerCase().includes(searchApplied.toLowerCase()) ||
        e.sigla.toLowerCase().includes(searchApplied.toLowerCase())
    );
  }, [especialidades, searchApplied]);

  const onAdd = async (values: EspecialidadeCreate) => {
    setError(null);
    try {
      await criarEspecialidade({
        nome: values.nome,
        sigla: values.sigla,
      });
      reset();
      setShowModal(false);
      await fetchEspecialidades();
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Erro ao adicionar especialidade.');
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    setDeletingId(id);
    try {
      await removerEspecialidade(id);
      setEspecialidades(especialidades =>
        especialidades.filter(e => e.id !== id)
      );
    } catch (e: any) {
      setError('Erro ao deletar especialidade.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchApplied(search);
  };

  const columns: TableColumn<Especialidade>[] = [
    {
      label: 'ID',
      key: 'id',
    },
    {
      label: 'Nome',
      key: 'nome',
      hiddeBtnCopy: false,
    },
    {
      label: 'Sigla',
      key: 'sigla',
      hiddeBtnCopy: false,
    },
    {
      label: 'Ações',
      key: 'acoes',
      render: row => (
        <PrimaryButton
          type="button"
          variant="negative"
          loading={deletingId === row.id}
          disabled={deletingId === row.id}
          onClick={() => {
            if (
              window.confirm(`Deseja apagar a especialidade "${row.nome}"?`)
            ) {
              handleDelete(row.id);
            }
          }}
        >
          Excluir
        </PrimaryButton>
      ),
      hiddeBtnCopy: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-2 py-8">
      <h1 className="text-xl mb-3 font-bold text-primary">Especialidades</h1>

      {/* Formulário de pesquisa */}
      <form
        className="flex items-end gap-2 mb-4"
        onSubmit={handleSearch}
        autoComplete="off"
      >
        <FormInput
          name="pesquisa"
          label="Pesquisar"
          placeholder="Nome ou sigla..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          inputProps={{ autoComplete: 'off', classNameContainer: 'w-full' }}
          noControl
          clear
        />

        <PrimaryButton
          type="submit"
          className="flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
          aria-label="Pesquisar"
        >
          <span className="material-icons" style={{ fontSize: 22 }}>
            search
          </span>
        </PrimaryButton>

        <PrimaryButton
          type="button"
          className=""
          variant="primary"
          onClick={() => {
            reset();
            setShowModal(true);
            setError(null);
          }}
        >
          Nova Especialidade
        </PrimaryButton>
      </form>

      <div className="mb-4"></div>

      <Modal
        isOpen={showModal}
        onClose={open => setShowModal(open)}
        title="Adicionar Especialidade"
        fit
      >
        <form
          className="flex flex-col md:flex-row gap-2 bg-gray-50 py-3 mb-4"
          onSubmit={handleSubmit(onAdd)}
          autoComplete="off"
        >
          <FormInput
            name="nome"
            label="Nome"
            placeholder="Nome da especialidade"
            inputProps={{
              ...register('nome', { required: 'Nome obrigatório' }),
              maxLength: 40,
              autoComplete: 'off',
            }}
            errors={errors}
          />
          <FormInput
            name="sigla"
            label="Sigla"
            placeholder="Sigla"
            inputProps={{
              ...register('sigla', {
                required: 'Sigla obrigatória',
                maxLength: 10,
              }),
              maxLength: 10,
              autoComplete: 'off',
            }}
            errors={errors}
          />
          <PrimaryButton
            type="submit"
            loading={isSubmitting}
            variant="primary"
            className="whitespace-nowrap"
          >
            Adicionar
          </PrimaryButton>
        </form>
        {/* Mensagem de erro dentro do modal */}
        {error && (
          <div className="bg-red-50 text-red-600 px-3 py-2 mb-4 rounded border border-red-200">
            {error}
          </div>
        )}
      </Modal>

      {/* Mensagem de erro geral */}
      {!showModal && error && (
        <div className="bg-red-50 text-red-600 px-3 py-2 mb-4 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Tabela */}
      <Table
        data={especialidadesFiltradas}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhuma especialidade encontrada."
      />
    </div>
  );
};

export default EspecialidadeList;
