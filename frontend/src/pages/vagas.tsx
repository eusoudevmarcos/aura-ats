import { PlusIcon } from "@/components/icons";
import VagaForm from "@/components/form/VagaForm";
import VagaList from "@/components/list/VagaList";
import { useState } from "react";
import Modal from "@/components/modal/Modal";

export default function Vagas() {
  const [showVagasForm, setShowVagasForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // chave para forçar atualização

  return (
    <>
      <button className="buttonPrimary" onClick={() => setShowVagasForm(true)}>
        <PlusIcon />
        Cadastrar Vaga
      </button>
      <VagaList key={refreshKey} />
      {showVagasForm && (
        <Modal isOpen={showVagasForm} title="Dados da vaga">
          <VagaForm
            onSuccess={() => {
              setShowVagasForm(false);
              setRefreshKey((prev) => prev + 1);
            }}
          />
        </Modal>
      )}
    </>
  );
}
