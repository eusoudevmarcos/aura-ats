import cardsStyles from "@/components/Card/Cards.module.css"; // Para cards gerais e placeholders
export default function Configuracoes() {
  return (
    <section>
      <h2>Entrevista</h2>

      <div
        className={cardsStyles.placeholderCard}
        style={{ marginTop: "32px" }}
      >
        <p>Conteúdo da seção Entrevistas (detalhado)</p>
      </div>
    </section>
  );
}
