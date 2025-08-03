import cardsStyles from "@/components/Cards/Cards.module.css"; // Para cards gerais e placeholders
export default function Testes() {
  return (
    <div className={cardsStyles.placeholderCard} style={{ marginTop: "32px" }}>
      <p>Conteúdo da seção Testes</p>
    </div>
  );
}
