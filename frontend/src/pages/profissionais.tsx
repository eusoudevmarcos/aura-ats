import ProfissionalForm from "@/components/form/profissionalForm";
import { PlusIcon } from "@/components/icons";
import Modal from "@/components/modal/Modal";
import ProfessionalsList from "@/components/Professionals/ProfessionalsList";
import { useState } from "react";

export default function Profissionais() {
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
    setMessage(""); // Limpa a mensagem ao fechar o modal
  };
  return (
    <>
      <button
        className="buttonPrimary"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        <PlusIcon />
        Cadastrar Profissional
      </button>

      <h2>Profissionais</h2>

      <ProfessionalsList />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Cadastro de Profissional"
      >
        <ProfissionalForm
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
}
