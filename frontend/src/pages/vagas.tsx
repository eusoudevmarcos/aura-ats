import { AdminGuard } from '@/components/auth/AdminGuard';
import { PrimaryButton } from '@/components/button/PrimaryButton';
import { PlusIcon } from '@/components/icons';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic imports para componentes pesados
const VagaForm = dynamic(
  () => import('@/components/form/VagaForm'),
  {
    loading: () => (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-primary">Carregando formulário...</span>
      </div>
    ),
    ssr: false,
  }
);

const VagaList = dynamic(
  () => import('@/components/list/VagaList'),
  {
    ssr: false,
  }
);

const Modal = dynamic(
  () => import('@/components/modal/Modal'),
  {
    ssr: false,
  }
);

export default function Vagas() {
  const [showVagasForm, setShowVagasForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <div className="flex flex-row-reverse items-center w-full justify-between mb-2">
        <AdminGuard>
          <PrimaryButton onClick={() => setShowVagasForm(true)}>
            <PlusIcon />
            Cadastrar Vaga
          </PrimaryButton>
        </AdminGuard>

        <h2 className="text-2xl font-bold text-primary">Lista de Vagas</h2>
      </div>

      <VagaList key={refreshKey} />

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
