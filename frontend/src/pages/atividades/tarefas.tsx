import cardsStyles from "@/components/Cards/Cards.module.css";
import { PlusIcon } from "@/components/icons";
import AtividadeLayout from "@/layout/AtividadesLayout";

export default function tarefas() {
  return (
    <AtividadeLayout>
      <button className="buttonPrimary">
        <PlusIcon />
        Cadastrar tarefa
      </button>
      <p>Conteúdo da seção Entrevistas (detalhado)</p>
    </AtividadeLayout>
  );
}
