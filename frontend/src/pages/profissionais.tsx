import { PlusIcon } from "@/components/icons";
import ProfessionalsList from "@/components/Professionals/ProfessionalsList";

export default function Profissionais() {
  return (
    <>
      <button className="buttonPrimary">
        <PlusIcon />
        Cadastrar Profissional
      </button>

      <h2>Profissionais</h2>

      <ProfessionalsList />
      {/* showProfessionalForm && (
               <ProfessionalsForm onClose={() => setShowProfessionalForm(false)} />
            )*/}
    </>
  );
}
