import cardsStyles from "@/components/Card/Cards.module.css";
import AtividadeLayout from "@/layout/AtividadesLayout";
export default function Entrevistas() {
  return (
    <AtividadeLayout>
      <div
        className={cardsStyles.placeholderCard}
        style={{ marginTop: "32px" }}
      >
        <p>Conteúdo da seção Entrevistas (detalhado)</p>
      </div>
    </AtividadeLayout>
  );
}
