import { PrimaryButton } from '@/components/button/PrimaryButton';
import { PlusIcon } from '@/components/icons';
import CandidatoList from '@/components/list/CandidatoList';
import ModalCandidatoForm from '@/components/modal/ModalCandidatoForm';
import { useState } from 'react';

export default function Profissionais() {
  const [showCandidatoForm, setShowCandidatoForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CandidatoList key={refreshKey} />

      <PrimaryButton
        className="float-right mt-4"
        onClick={() => setShowCandidatoForm(true)}
      >
        <PlusIcon />
        Cadastrar Profissional
      </PrimaryButton>

      <ModalCandidatoForm
        isOpen={showCandidatoForm}
        onClose={() => setShowCandidatoForm(false)}
        onSuccess={() => {
          setRefreshKey(prev => prev + 1);
        }}
      />
    </>
  );
}
