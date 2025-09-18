// pages/agenda/[id].tsx
import api from '@/axios';
import Card from '@/components/Card';
import { EditPenIcon, TrashIcon } from '@/components/icons';
import Modal from '@/components/modal/Modal';
import { useCliente } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const AgendaPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const isCliente = useCliente();

  const [agenda, setAgenda] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchAgenda = async () => {
      setLoading(true);
      setErro(null);
      try {
        const res = await api.get(`/api/external/agenda/${id}`);
        setAgenda(res.data);
      } catch (_) {
        setErro('Agenda não encontrada ou erro ao buscar dados.');
        setAgenda(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAgenda();
  }, [id]);

  const handleTrash = async () => {
    if (!agenda) return;
    if (confirm('Tem certeza que deseja excluir esta agenda?')) {
      try {
        await api.delete(`/api/external/agenda/${agenda.id}`);
        router.push('/agendas');
      } catch {
        alert('Erro ao excluir agenda.');
      }
    }
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

  if (!agenda) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <section className="bg-white p-4 rounded-2xl">
        <div className="flex mb-8">
          <button
            className="px-2 py-2 bg-primary text-white rounded shadow-md hover:scale-110"
            onClick={() => router.back()}
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-center text-primary w-full">
            Detalhes da Agenda
          </h1>
          {isCliente && (
            <div className="flex gap-2">
              <button
                className="px-2 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110"
                onClick={() => setShowModalEdit(true)}
              >
                <EditPenIcon />
              </button>
              <button
                className="px-2 py-2 bg-[#f72929] text-white rounded shadow-md hover:scale-110"
                onClick={handleTrash}
              >
                <TrashIcon />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Sessão Dados da Agenda */}
          <Card title="Dados da Agenda">
            <div>
              <span className="font-medium">Data e Hora:</span>{' '}
              {agenda.dataHora
                ? new Date(agenda.dataHora).toLocaleString('pt-BR')
                : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Tipo do Evento:</span>{' '}
              {agenda.tipoEvento?.replace(/_/g, ' ') || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Link:</span> {agenda.link || 'N/A'}
            </div>
          </Card>

          {/* Sessão Localização */}
          {agenda.localizacao && (
            <Card title="Localização">
              {agenda.localizacao.cidade && (
                <div>
                  <span className="font-medium">Cidade:</span>{' '}
                  {agenda.localizacao.cidade}
                </div>
              )}
              {agenda.localizacao.estado && (
                <div>
                  <span className="font-medium">Estado:</span>{' '}
                  {agenda.localizacao.estado}
                </div>
              )}
              {agenda.localizacao.cep && (
                <div>
                  <span className="font-medium">CEP:</span>{' '}
                  {agenda.localizacao.cep}
                </div>
              )}
              {agenda.localizacao.bairro && (
                <div>
                  <span className="font-medium">Bairro:</span>{' '}
                  {agenda.localizacao.bairro}
                </div>
              )}
              {agenda.localizacao.uf && (
                <div>
                  <span className="font-medium">UF:</span>{' '}
                  {agenda.localizacao.uf}
                </div>
              )}
              {agenda.localizacao.complemento && (
                <div>
                  <span className="font-medium">Complemento:</span>{' '}
                  {agenda.localizacao.complemento}
                </div>
              )}
              {agenda.localizacao.logradouro && (
                <div>
                  <span className="font-medium">Logradouro:</span>{' '}
                  {agenda.localizacao.logradouro}
                </div>
              )}
              {agenda.localizacao.regiao && (
                <div>
                  <span className="font-medium">Região:</span>{' '}
                  {agenda.localizacao.regiao}
                </div>
              )}
            </Card>
          )}

          {/* Sessão Vaga */}
          {agenda.vaga && (
            <Card title="Vaga Associada">
              <div>
                <span className="font-medium">Título:</span>{' '}
                {agenda.vaga.titulo || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Status:</span>{' '}
                {agenda.vaga.status || 'N/A'}
              </div>
              {/* Adicione mais campos relevantes da vaga se necessário */}
            </Card>
          )}

          {/* Sessão Etapa Atual */}
          {agenda.etapaAtual && (
            <Card title="Etapa Atual do Processo Seletivo">
              <div>
                <span className="font-medium">Nome:</span>{' '}
                {agenda.etapaAtual.nome}
              </div>
              <div>
                <span className="font-medium">Tipo:</span>{' '}
                {agenda.etapaAtual.tipo}
              </div>
              <div>
                <span className="font-medium">Ordem:</span>{' '}
                {agenda.etapaAtual.ordem}
              </div>
              <div>
                <span className="font-medium">Descrição:</span>{' '}
                {agenda.etapaAtual.descricao || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Ativa:</span>{' '}
                {agenda.etapaAtual.ativa ? 'Sim' : 'Não'}
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Modal de edição pode ser implementado futuramente */}
      <Modal
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        title="Editar Agenda"
      >
        <div className="text-center text-gray-500 p-4">
          Formulário de edição da agenda em breve.
        </div>
      </Modal>
    </div>
  );
};

export default AgendaPage;
