import React from "react";
import styles from "@/styles/takeit.module.css";

interface PersonDetails {
  [key: string]: any;
}

interface AtividadesTabProps {
  data: PersonDetails;
}

const AtividadesTab: React.FC<AtividadesTabProps> = ({ data }) => {
  return (
    <div className="tab-content">
      <h3>Atividades</h3>
      <div className={styles.fieldRow}>
        <strong>CBO:</strong>
        <span>
          {data.cbo_code || "N/A"} - {data.cbo_description || "N/A"}
        </span>
      </div>
      <div className={styles.fieldRow}>
        <strong>Renda Estimada:</strong>
        <span>{data.estimated_income || "N/A"}</span>
      </div>
      <div className={styles.fieldRow}>
        <strong>Profissão:</strong>
        <span>{data.profession || "N/A"}</span>
      </div>
    </div>
  );
};

export default AtividadesTab;
