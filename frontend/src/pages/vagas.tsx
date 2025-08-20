import { PlusIcon } from "@/components/icons";
import VagasForm from "@/components/Vagas/VagasForm";
import VagaList from "@/components/list/VagaList";
import { useState } from "react";

export default function Vagas() {
  const [showVagasForm, setShowVagasForm] = useState(false);

  return (
    <>
      <button className="buttonPrimary" onClick={() => setShowVagasForm(true)}>
        <PlusIcon />
        Cadastrar Vaga
      </button>
      <VagaList />
      {showVagasForm && <VagasForm onClose={() => setShowVagasForm(false)} />}
    </>
  );
}
