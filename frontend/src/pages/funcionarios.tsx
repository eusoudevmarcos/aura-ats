import { PrimaryButton } from '@/components/button/PrimaryButton';
import { FuncionarioForm } from '@/components/form/FuncionarioForm';
import { PlusIcon } from '@/components/icons';
import FuncionariosList from '@/components/list/FuncionariosList';
import Modal from '@/components/modal/Modal';
import { useState } from 'react';

export default function Funcionarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onSuccess = (msg: boolean) => {
    setIsModalOpen(!msg);
  };
  return (
    <>
      <FuncionariosList />

      <PrimaryButton
        className="float-right mt-4"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusIcon />
        Cadastrar Funcionario
      </PrimaryButton>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Cadastro de Funcionario"
      >
        <FuncionarioForm onSuccess={onSuccess} />
      </Modal>
    </>
  );
}
