import ClientForms from "@/components/Clients/ClientForms";
import ClientList from "@/components/Clients/ClientList";
import { PlusIcon } from "@/components/icons";
import { useState } from "react";

export default function Clientes() {
  const [showClientForm, setShowClientForm] = useState(false);
  return (
    <>
      <button className="buttonPrimary" onClick={() => setShowClientForm(true)}>
        <PlusIcon />
        Cadastrar Cliente
      </button>
      <h2>Clientes</h2>

      <ClientList />
      {showClientForm && (
        <ClientForms onClose={() => setShowClientForm(false)} />
      )}
    </>
  );
}
