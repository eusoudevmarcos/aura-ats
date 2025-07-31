import React from "react";
import styles from "@/styles/takeit.module.css";

interface PersonDetails {
  [key: string]: any;
}

interface SociedadeTabProps {
  data: PersonDetails;
}

const SociedadeTab: React.FC<SociedadeTabProps> = ({ data }) => {
  return (
    <div className="tab-content">
      <h3>Sociedade</h3>
      {data.related_companies && data.related_companies.length > 0 ? (
        data.related_companies.map((company: any, index: number) => (
          <div key={index} className={styles.fieldRow}>
            <strong>Empresa {index + 1}:</strong>
            <span>
              {company.company_name} - CNPJ: {company.cnpj}
            </span>
          </div>
        ))
      ) : (
        <div className={styles.fieldRow}>
          <strong>Sociedade:</strong>
          <span className={styles.valueNa}>Nenhuma sociedade cadastrada</span>
        </div>
      )}
    </div>
  );
};

export default SociedadeTab;
