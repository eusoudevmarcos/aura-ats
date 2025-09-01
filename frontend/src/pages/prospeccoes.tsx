import { PrimaryButton } from '@/components/button/PrimaryButton';
import ClienteForm from '@/components/form/ClienteForm';
import { PlusIcon } from '@/components/icons';
import ClientList from '@/components/list/ClientList';
import Modal from '@/components/modal/Modal';
import { useState } from 'react';

export default function Clientes() {
  const [showClientForm, setShowClientForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // chave para forçar atualização

  return (
    <>
      <ClientList key={refreshKey} onlyProspects />

      <PrimaryButton
        className="float-right mt-4"
        onClick={() => setShowClientForm(true)}
      >
        <PlusIcon />
        Cadastrar Prospects
      </PrimaryButton>

      <Modal
        title="Cadastrar Prospects"
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
      >
        <ClienteForm
          initialValues={{ status: 'PROSPECT' }}
          onSuccess={() => {
            setShowClientForm(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      </Modal>
    </>
  );
}
