import { PrimaryButton } from '@/components/button/PrimaryButton';
import CandidatoForm from '@/components/form/CandidatoForm';
import { PlusIcon } from '@/components/icons';
import CandidatoList from '@/components/list/CandidatoList';
import Modal from '@/components/modal/Modal';
import { useState } from 'react';

export default function Profissionais() {
  const [showClientForm, setShowClientForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CandidatoList key={refreshKey} />

      <PrimaryButton
        className="float-right mt-4"
        onClick={() => setShowClientForm(true)}
      >
        <PlusIcon />
        Cadastrar Profissional
      </PrimaryButton>

      <Modal
        title="Cadastrar Profissionais"
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
      >
        <CandidatoForm
          onSuccess={() => {
            setShowClientForm(false);
            setRefreshKey(prev => prev + 1); // força re-render do ClientList
          }}
        />
      </Modal>
    </>
  );
}
