// pages/cliente/[uuid].tsx
import api from '@/axios';
import { getClienteById, getVagasClienteById } from '@/axios/cliente.axios';
import { PrimaryButton } from '@/components/button/PrimaryButton';
import Card from '@/components/Card';
import ClienteInfo from '@/components/cliente/ClienteInfo';
import VagaForm from '@/components/form/VagaForm';
import Loading from '@/components/global/loading/Loading';
import { EditPenIcon, PlusIcon, TrashIcon } from '@/components/icons';
import VagaList from '@/components/list/VagaList';
import Modal from '@/components/modal/Modal';
import ModalClienteForm from '@/components/modal/ModalClienteForm';
import { ModalPlanoCliente } from '@/components/modal/ModalPlanoCliente';
import { ModalVagasCliente } from '@/components/modal/ModalVagasCliente';
import { useAdmin } from '@/context/AuthContext';
import { ClienteWithEmpresaAndVagaInput } from '@/schemas/cliente.schema';
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
  const [modalPlanosCliente, setModalPlanosCliente] = useState(false);
  const [modalVagasCliente, setModalVagasCliente] = useState(false);
  const [cliente, setCliente] = useState<ClienteWithEmpresaAndVagaInput | null>(
    initialValues ?? null
  );

  const [clienteCarregado, setClienteCarregado] = useState<boolean>(
    !!initialValues
  );

  const isAdmin = useAdmin();

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
        const cliente = await getClienteById(uuid as string);
        const vagas = await getVagasClienteById(uuid as string);
        cliente.vagas = vagas;
        setCliente(cliente);
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

  const handleTrash = async () => {
    if (!cliente) return;
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        const response = await api.delete(`/api/externalWithAuth/cliente`, {
          data: { id: cliente.id },
        });
        console.log(response);
        if (response.data) {
          await router.push('/clientes');
        }
      } catch {
        alert('Erro ao excluir cliente.');
      }
    }
  };

  React.useEffect(() => {
    setPaginaAtual(1);
  }, [cliente]);

  const totalPaginas = Math.ceil(
    (cliente?.vagas?.length ?? 0) / ITENS_POR_PAGINA
  );

  if (loading) {
    return <Loading label="Carregando Cliente e Vagas..." />;
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

            {isAdmin && (
              <div className="flex gap-2">
                <button
                  className="px-2 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110 flex items-center justify-center"
                  onClick={() => setModalVagasCliente(true)}
                >
                  <span className="material-icons-outlined m-0 p-0">cases</span>
                </button>
                <button
                  className="px-2 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110 flex items-center justify-center"
                  onClick={() => setModalPlanosCliente(true)}
                >
                  <span className="material-icons-outlined m-0 p-0">
                    wallet
                  </span>
                </button>
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
            )}
          </div>
        )}

        <Card>
          <h3 className="text-lg text-primary font-bold">Dados do cliente</h3>
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
      </div>

      <section className="mb-4">
        <VagaList initialValues={cliente?.vagas} />
      </section>

      {/* Seção de Planos */}
      {cliente?.planos && (
        <ModalPlanoCliente
          isOpen={modalPlanosCliente}
          onClose={() => {
            setModalPlanosCliente(false);
          }}
          planos={cliente.planos as any}
        />
      )}

      {modalVagasCliente && (
        <ModalVagasCliente open={modalVagasCliente} uuid={uuid as string} />
      )}

      {showModalEdit && (
        <ModalClienteForm
          isOpen={showModalEdit}
          onClose={() => setShowModalEdit(false)}
          initialValues={cliente}
          onSuccess={clienteAtualizado => {
            setCliente(clienteAtualizado);
          }}
        />
      )}

      {showVagasForm && (
        <Modal
          isOpen={showVagasForm}
          onClose={() => {
            setShowVagasForm(false);
          }}
          title={`Vaga do cliente`}
        >
          <VagaForm
            onSuccess={vaga => {
              setShowVagasForm(false);
              // Atualizar as vagas após cadastrar uma nova vaga
              // refetchVagas({ search: cliente.id });
            }}
            initialValues={{ cliente } as any}
            isBtnDelete={false}
            isBtnView={false}
            showInput={false}
          />
        </Modal>
      )}
    </div>
  );
};

export default ClientePage;
