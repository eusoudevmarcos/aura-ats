import ClientList from "@/components/Clients/ClientList";
import ClienteForm from "@/components/form/ClienteForm";
import { PlusIcon } from "@/components/icons";
import Modal from "@/components/modal/Modal";
import { useState } from "react";

export default function Clientes() {
  const [showClientForm, setShowClientForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // chave para forçar atualização

  return (
    <>
      <button className="buttonPrimary" onClick={() => setShowClientForm(true)}>
        <PlusIcon />
        Cadastrar Cliente
      </button>

      {/* Passa a chave para o ClientList */}
      <ClientList key={refreshKey} />

      <Modal
        title="Cadastrar Cliente"
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
      >
        <ClienteForm
          onSuccess={() => {
            setShowClientForm(false);
            setRefreshKey((prev) => prev + 1); // força re-render do ClientList
          }}
        />
      </Modal>
    </>
  );
}
