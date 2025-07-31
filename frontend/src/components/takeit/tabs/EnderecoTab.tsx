import React from "react";
import styles from "@/styles/takeit.module.css";

interface PersonDetails {
  [key: string]: any;
}

interface EnderecoTabProps {
  data: PersonDetails;
}

const EnderecoTab: React.FC<EnderecoTabProps> = ({ data }) => {
  return (
    <div className="tab-content">
      <h3>Endereço</h3>
      {data.addresses && data.addresses.length > 0 ? (
        data.addresses.map((address: any, index: number) => (
          <div key={index} className={styles.fieldRow}>
            <strong>Endereço {index + 1}:</strong>
            <span>
              {address.street}, {address.number} - {address.neighborhood},{" "}
              {address.city} - {address.district}, CEP: {address.postal_code}
            </span>
          </div>
        ))
      ) : (
        <div className={styles.fieldRow}>
          <strong>Endereço:</strong>
          <span className={styles.valueNa}>Nenhum endereço cadastrado</span>
        </div>
      )}
    </div>
  );
};

export default EnderecoTab;
