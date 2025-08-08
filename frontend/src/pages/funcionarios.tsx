import ClientForms from "@/components/Clients/ClientForms";
import ClientList from "@/components/Clients/ClientList";
import { FuncionarioForm } from "@/components/form/funcionarioForm";
import { PlusIcon } from "@/components/icons";
import FuncionariosList from "@/components/list/FuncionariosList";
import Modal from "@/components/modal/Modal";
import { useState } from "react";

export default function Funcionarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSuccess = () => {
    setMessage("Funcionário cadastrado com sucesso!");
    setIsError(false);
  };

  const handleError = (msg: string) => {
    setMessage(msg);
    setIsError(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage("");
  };

  const onSuccess = (msg: boolean) => {
    console.log(msg);
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
        title="Cadastro de Profissional"
      >
        <FuncionarioForm onSuccess={onSuccess} />
      </Modal>
    </>
  );
}
