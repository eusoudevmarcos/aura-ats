import React from "react";
import styles from "@/styles/takeit.module.css";

interface PersonDetails {
  [key: string]: any;
}

interface DadosCadastraisTabProps {
  data: PersonDetails;
}

const DadosCadastraisTab: React.FC<DadosCadastraisTabProps> = ({ data }) => {
  return (
    <div className="tab-content">
      <h3>Dados Cadastrais</h3>
      <div className={styles.fieldRow}>
        <strong>Nome:</strong>
        <span>{data.name || "N/A"}</span>
      </div>
      <div className={styles.fieldRow}>
        <strong>CPF:</strong>
        <span>{data.cpf || "N/A"}</span>
      </div>
      <div className={styles.fieldRow}>
        <strong>RG:</strong>
        <span>{data.rg || "N/A"}</span>
      </div>
      <div className={styles.fieldRow}>
        <strong>Data de Nascimento:</strong>
        <span>{data.birthday || "N/A"}</span>
      </div>
      <div className={styles.fieldRow}>
        <strong>Nome da Mãe:</strong>
        <span>{data.mother_name || "N/A"}</span>
      </div>
      <div className={styles.fieldRow}>
        <strong>Sexo:</strong>
        <span>{data.gender || "N/A"}</span>
      </div>
    </div>
  );
};

export default DadosCadastraisTab;
