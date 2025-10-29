import { PrimaryButton } from '@/components/button/PrimaryButton';
import ClienteForm from '@/components/form/ClienteForm';
import { PlusIcon } from '@/components/icons';
import ClienteList from '@/components/list/ClienteList';
import Modal from '@/components/modal/Modal';
import { useState } from 'react';

export default function Clientes() {
  const [showClientForm, setShowClientForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <ClienteList key={refreshKey} />

      <PrimaryButton
        className="float-right mt-4"
        onClick={() => setShowClientForm(true)}
      >
        <PlusIcon />
        Cadastrar Cliente
      </PrimaryButton>

      <Modal
        title="Cadastrar Cliente"
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
      >
        <ClienteForm
          onSuccess={() => {
            setShowClientForm(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      </Modal>
    </>
  );
}
