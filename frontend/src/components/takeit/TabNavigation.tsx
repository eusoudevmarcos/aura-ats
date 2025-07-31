import React, { useState } from "react";
import DadosCadastraisTab from "./tabs/DadosCadastraisTab";
import EnderecoTab from "./tabs/EnderecoTab";
import SociedadeTab from "./tabs/SociedadeTab";
import AtividadesTab from "./tabs/AtividadesTab";
import ContatosTab from "./tabs/ContatosTab";
import styles from "@/styles/takeit.module.css";

interface PersonDetails {
  [key: string]: any;
}

interface TabNavigationProps {
  personDetails: PersonDetails;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ personDetails }) => {
  const tabs = [
    "Dados Cadastrais",
    "Endereço",
    "Sociedade",
    "Atividades",
    "Contatos",
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  const renderActiveTab = (): React.ReactNode => {
    switch (activeTab) {
      case "Dados Cadastrais":
        return <DadosCadastraisTab data={personDetails} />;
      case "Endereço":
        return <EnderecoTab data={personDetails} />;
      case "Sociedade":
        return <SociedadeTab data={personDetails} />;
      case "Atividades":
        return <AtividadesTab data={personDetails} />;
      case "Contatos":
        return <ContatosTab data={personDetails} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.tabNavigation}>
      <div className="tab-buttons">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${styles.tabButton} ${
              activeTab === tab ? styles.active : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content-container">{renderActiveTab()}</div>
    </div>
  );
};

export default TabNavigation;
