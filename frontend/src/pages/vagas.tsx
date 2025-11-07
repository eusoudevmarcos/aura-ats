import { AdminGuard } from '@/components/auth/AdminGuard';
import { PrimaryButton } from '@/components/button/PrimaryButton';
import VagaForm from '@/components/form/VagaForm';
import { PlusIcon } from '@/components/icons';
import VagaList from '@/components/list/VagaList';
import Modal from '@/components/modal/Modal';
import { useState } from 'react';

export default function Vagas() {
  const [showVagasForm, setShowVagasForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // chave para forçar atualização

  return (
    <>
      <VagaList key={refreshKey} />

      <AdminGuard>
        <PrimaryButton
          className="float-right mt-4"
          onClick={() => setShowVagasForm(true)}
        >
          <PlusIcon />
          Cadastrar Vaga
        </PrimaryButton>
      </AdminGuard>
      
      {showVagasForm && (
        <Modal
          isOpen={showVagasForm}
          onClose={() => {
            setShowVagasForm(false);
          }}
          title="Cadastrar Vaga"
        >
          <VagaForm
            onSuccess={() => {
              setShowVagasForm(false);
              setRefreshKey(prev => prev + 1);
            }}
          />
        </Modal>
      )}
    </>
  );
}
