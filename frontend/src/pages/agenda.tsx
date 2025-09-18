import { PrimaryButton } from '@/components/button/PrimaryButton';
import { AgendaForm } from '@/components/form/AgendaForm';
import { PlusIcon } from '@/components/icons';
import AgendaList from '@/components/list/AgendaList';
import Modal from '@/components/modal/Modal';
import { useCliente } from '@/context/AuthContext';
import { useState } from 'react';

export default function Agenda() {
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isCliente = useCliente();
  return (
    <>
      <AgendaList key={refreshKey} />

      {isCliente && (
        <PrimaryButton
          className="float-right mt-4"
          onClick={() => setShowAgendaForm(true)}
        >
          <PlusIcon />
          Cadastrar Agendamento
        </PrimaryButton>
      )}

      <Modal
        title="Cadastrar Agendamento"
        isOpen={showAgendaForm}
        onClose={() => setShowAgendaForm(false)}
      >
        <AgendaForm
          onSuccess={() => {
            setShowAgendaForm(false);
            setRefreshKey(prev => prev + 1); // força re-render do AgendaList
          }}
        />
      </Modal>
    </>
  );
}
