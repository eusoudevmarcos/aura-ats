import cardsStyles from "@/components/Cards/Cards.module.css";
import { PlusIcon } from "@/components/icons";
import AtividadeLayout from "@/layout/AtividadesLayout";
export default function Agenda() {
  return (
    <AtividadeLayout>
      <button className="buttonPrimary">
        <PlusIcon />
        Cadastrar Agenda
      </button>

      <div className="mt-10">Conteúdo da seção Entrevistas (detalhado)</div>
    </AtividadeLayout>
  );
}
