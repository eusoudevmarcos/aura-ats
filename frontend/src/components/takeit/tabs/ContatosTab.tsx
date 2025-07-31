import React from "react";
import styles from "@/styles/takeit.module.css";

interface PersonDetails {
  [key: string]: any;
}

interface ContatosTabProps {
  data: PersonDetails;
}

const ContatosTab: React.FC<ContatosTabProps> = ({ data }) => {
  return (
    <div className="tab-content">
      <h3>Contatos</h3>
      <div className={styles.fieldRow}>
        <strong>Telefones:</strong>
        <span>
          {data.mobile_phones && data.mobile_phones.length > 0
            ? data.mobile_phones
                .map((phone: any) => `(${phone.ddd}) ${phone.number}`)
                .join(", ")
            : "N/A"}
        </span>
      </div>
      <div className={styles.fieldRow}>
        <strong>E-mails:</strong>
        <span>
          {data.emails && data.emails.length > 0
            ? data.emails.map((email: any) => email.email).join(", ")
            : "N/A"}
        </span>
      </div>
    </div>
  );
};

export default ContatosTab;
