import { PrimaryButton } from '@/components/button/PrimaryButton';
import { AgendaForm } from '@/components/form/AgendaForm';
import { PlusIcon } from '@/components/icons';
import AgendaList from '@/components/list/AgendaList';
import Modal from '@/components/modal/Modal';
import { useUser } from '@/hook/useUser';
import { TipoUsuarioEnum } from '@/schemas/funcionario.schema';
import { useState } from 'react';

export default function Agenda() {
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const user = useUser();

  return (
    <>
      <AgendaList key={refreshKey} />

      {user.tipo !== TipoUsuarioEnum.enum.CLIENTE_ATS &&
        user.tipo !== TipoUsuarioEnum.enum.CLIENTE_ATS_CRM &&
        user.tipo !== TipoUsuarioEnum.enum.CLIENTE_CRM && (
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
