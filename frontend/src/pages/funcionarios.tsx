import { FuncionarioForm } from "@/components/form/FuncionarioForm";
import { PlusIcon } from "@/components/icons";
import FuncionariosList from "@/components/list/FuncionariosList";
import Modal from "@/components/modal/Modal";
import { useState } from "react";

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
      <button className="buttonPrimary" onClick={() => setIsModalOpen(true)}>
        <PlusIcon />
        Cadastrar Funcionario
      </button>

      <FuncionariosList />

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
