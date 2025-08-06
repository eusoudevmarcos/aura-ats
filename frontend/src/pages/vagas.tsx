import { PlusIcon } from "@/components/icons";
import VagasForm from "@/components/Vagas/VagasForm";
import VagasList from "@/components/Vagas/VagasList";
import { useState } from "react";

export default function Vagas() {
  const [showVagasForm, setShowVagasForm] = useState(false);

  return (
    <>
      <button className="buttonPrimary" onClick={() => setShowVagasForm(true)}>
        <PlusIcon />
        Cadastrar Vaga
      </button>
      <VagasList />
      {showVagasForm && <VagasForm onClose={() => setShowVagasForm(false)} />}
    </>
  );
}
