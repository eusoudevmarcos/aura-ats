import { AgendaForm } from '@/components/form/AgendaForm';
import { PlusIcon } from '@/components/icons';
import AgendaList from '@/components/list/AgendaList';
import Modal from '@/components/modal/Modal';
import AtividadeLayout from '@/layout/AtividadesLayout';
import { useState } from 'react';

export default function Agendas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onSuccess = (msg: boolean) => {
    setIsModalOpen(!msg);
    setRefreshKey(refreshKey + 1);
  };

  return (
    <AtividadeLayout>
      <button
        className="buttonPrimary flex items-center gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusIcon />
        Cadastrar Agenda
      </button>

      <AgendaList key={refreshKey} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Cadastro de Agenda"
      >
        <AgendaForm onSuccess={onSuccess} />
      </Modal>
    </AtividadeLayout>
  );
}
