// pages/cliente/[uuid].tsx
import api from '@/axios';
import { PrimaryButton } from '@/components/button/PrimaryButton';
import Card from '@/components/Card';
import ClienteInfo from '@/components/cliente/ClienteInfo';
import ClienteForm from '@/components/form/ClienteForm';
import VagaForm from '@/components/form/VagaForm';
import { EditPenIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { VagaWithRelations } from '@/components/list/VagaList';
import Modal from '@/components/modal/Modal';
import useFetchWithPagination from '@/hook/useFetchWithPagination';
import { ClienteWithEmpresaAndVagaInput } from '@/schemas/cliente.schema';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const ITENS_POR_PAGINA = 6;

const ClientePage: React.FC<{
  initialValues?: ClienteWithEmpresaAndVagaInput;
}> = ({ initialValues }) => {
  const router = useRouter();
  const { uuid } = router.query;
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showVagasForm, setShowVagasForm] = useState(false);
  const [cliente, setCliente] = useState<ClienteWithEmpresaAndVagaInput | null>(
    initialValues ?? null
  );

  const [clienteCarregado, setClienteCarregado] = useState<boolean>(
    !!initialValues
  );

  const {
    data: vagas,
    total: totalRecords,
    totalPages,
    loading: isLoadingVagas,
    setPage,
    setPageSize,
    page,
    pageSize,
    refetch: refetchVagas,
  } = useFetchWithPagination<VagaWithRelations>(
    `/api/externalWithAuth/vaga/cliente/${cliente?.id}`,
    cliente && cliente.id ? { search: cliente.id } : {},
    {
      pageSize: 5,
      page: 1,
      dependencies: [cliente?.id],
      manual: true,
      requestOptions: {},
    }
  );

  useEffect(() => {
    if (!uuid || initialValues) {
      setLoading(false);
      setClienteCarregado(true);
      return;
    }

    const fetchCliente = async () => {
      setLoading(true);
      setErro(null);
      try {
        const res = await api.get(`/api/externalWithAuth/cliente/${uuid}`);
        setCliente(res.data);
        setClienteCarregado(true);
      } catch (_) {
        setErro('Cliente não encontrado ou erro ao buscar dados.');
        setCliente(null);
        setClienteCarregado(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [uuid, initialValues]);

  // Quando o cliente for carregado, buscar as vagas
  useEffect(() => {
    if (clienteCarregado && cliente && cliente.id) {
      refetchVagas({ search: cliente.id });
    }
  }, [clienteCarregado, cliente]);

  const handleTrash = async () => {
    if (!cliente) return;
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await api.delete(`/api/cliente/${cliente.id}`);
        router.push('/clientes');
      } catch {
        alert('Erro ao excluir cliente.');
      }
    }
  };

  // Resetar para página 1 se mudar o cliente
  React.useEffect(() => {
    setPaginaAtual(1);
  }, [cliente]);

  // Funções de paginação
  const totalPaginas = Math.ceil(vagas.length / ITENS_POR_PAGINA);

  const vagasPaginadas = vagas.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  const handleProximaPagina = () => {
    setPaginaAtual(prev => Math.min(prev + 1, totalPaginas));
  };

  const handlePaginaAnterior = () => {
    setPaginaAtual(prev => Math.max(prev - 1, 1));
  };

  const handleIrParaPagina = (pagina: number) => {
    setPaginaAtual(pagina);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-primary text-lg">Carregando...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-red-600 text-xl font-semibold mb-4">{erro}</span>
      </div>
    );
  }

  if (!cliente) return null;

  return (
    <div className="max-w-5xl mx-auto p-1">
      <section>
        <h1 className="text-2xl font-bold text-center text-primary w-full">
          CLIENTE
        </h1>

        {!initialValues && (
          <div className="flex mb-8 justify-between">
            <button
              className="px-2 py-2 bg-primary text-white rounded shadow-md hover:scale-110"
              onClick={() => router.back()}
            >
              Voltar
            </button>

            <div className="flex gap-2">
              <button
                className="px-2 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110"
                onClick={() => setShowModalEdit(true)}
              >
                <EditPenIcon />
              </button>
              <button
                className="px-2 py-2 bg-red-500 text-white rounded shadow-md hover:scale-110"
                onClick={handleTrash}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        )}

        <Card title="Dados do cliente">
          <ClienteInfo cliente={cliente} variant="full" />
        </Card>
      </section>

      <div className="flex justify-center mt-10 mb-4 relative">
        <h3 className="text-2xl font-bold text-center text-primary w-full ">
          VAGAS CADASTRADAS
        </h3>

        <PrimaryButton
          className="float-right flex text-nowrap absolute right-0"
          onClick={() => setShowVagasForm(true)}
        >
          <PlusIcon />
          <p className="hidden md:block">Cadastrar Vaga</p>
        </PrimaryButton>

        {showVagasForm && (
          <Modal
            isOpen={showVagasForm}
            onClose={() => {
              setShowVagasForm(false);
            }}
            title={`Vaga do cliente`}
          >
            <VagaForm
              initialValues={{ cliente: cliente, clienteId: cliente.id }}
              onSuccess={vaga => {
                setShowVagasForm(false);
                // Atualizar as vagas após cadastrar uma nova vaga
                refetchVagas({ search: cliente.id });
              }}
              isBtnDelete={false}
              isBtnView={false}
            />
          </Modal>
        )}
      </div>

      <section className="flex gap-2 w-full flex-wrap items-center justify-center lg:justify-between">
        {isLoadingVagas ? (
          <div className="flex justify-center items-center w-full h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-4 text-primary text-lg">
              Carregando vagas...
            </span>
          </div>
        ) : vagas.length > 0 ? (
          <>
            {vagasPaginadas.map((vaga: any) => (
              <Link
                href={`/vaga/${vaga.id}`}
                className="w-full lg:max-w-[330px]"
                key={vaga.id}
              >
                <Card
                  title={{
                    className: 'text-xl text-center',
                    label: vaga.titulo,
                  }}
                  classNameContainer="cursor-pointer shadow-sm border border-gray-200 hover:scale-105 hover:shadow-md text-sm px-6 py-4"
                >
                  <div className="flex flex-col justify-between gap-2 mt-2">
                    <div className="text-sm">
                      <span>Publicado:</span>
                      <span className="text-secondary">
                        {vaga.dataPublicacao}
                      </span>
                    </div>

                    <div>
                      <span className="font-medium">Status:</span>
                      <span className="ml-1 text-secondary">{vaga.status}</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium">Categoria:</span>
                    <span className="ml-1 text-secondary">
                      {vaga.categoria}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Tipo de Salário:</span>
                    <span className="ml-1 text-secondary">
                      {vaga.tipoSalario}
                    </span>
                  </div>

                  <div className="flex justify-between mt-4">
                    <div className="flex items-center">
                      <span className="material-icons-outlined">group</span>
                      <span className="ml-1 text-secondary">
                        {vaga._count.candidaturas}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="w-full flex justify-center mt-6">
                <nav className="flex gap-2 items-center">
                  <button
                    className="px-2 py-1 rounded border border-gray-300 bg-white text-primary disabled:opacity-50"
                    onClick={handlePaginaAnterior}
                    disabled={paginaAtual === 1}
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPaginas }, (_, idx) => (
                    <button
                      key={idx + 1}
                      className={`px-3 py-1 rounded border border-gray-300 ${
                        paginaAtual === idx + 1
                          ? 'bg-primary text-white'
                          : 'bg-white text-primary'
                      }`}
                      onClick={() => handleIrParaPagina(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    className="px-2 py-1 rounded border border-gray-300 bg-white text-primary disabled:opacity-50"
                    onClick={handleProximaPagina}
                    disabled={paginaAtual === totalPaginas}
                  >
                    Próxima
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <span className="text-primary text-center">
            Nenhuma vaga cadastrada para este cliente.
          </span>
        )}
      </section>

      <Modal
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        title="Editar Cliente"
      >
        <ClienteForm
          onSuccess={cliente => {
            setShowModalEdit(false);
            setCliente(cliente);
            // Atualizar as vagas caso o cliente seja editado
            if (cliente && cliente.id) {
              refetchVagas({ search: cliente.id });
            }
          }}
          initialValues={cliente}
        />
      </Modal>
    </div>
  );
};

export default ClientePage;
