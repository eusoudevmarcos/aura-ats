import ProfissionalForm from "@/components/form/ProfissionalForm";
import { PlusIcon } from "@/components/icons";
import Modal from "@/components/modal/Modal";
import ProfessionalsList from "@/components/Professionals/ProfessionalsList";
import { useState } from "react";

export default function Profissionais() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSuccess = () => {
    setIsError(false);
  };

  const handleError = (msg: string) => {
    setIsError(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
