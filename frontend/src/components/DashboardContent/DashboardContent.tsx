// frontend/components/DashboardContent/DashboardContent.tsx
import React, { useState } from "react";

// Importa os componentes de conteúdo
import PerformanceOverviewCard from "../Cards/PerformanceOverviewCard";
import RecentActivityCard from "../Cards/RecentActivityCard";
import ActivitySection from "../Activity/ActivitySection"; // Esta é a seção de Atividade com seu submenu interno
import ClientList from "../Clients/ClientList";
import ClientForms from "../Clients/ClientForms";
import ProfessionalsList from "../Professionals/ProfessionalsList";
import VagasList from "../Vagas/VagasList";
import VagasForm from "../Vagas/VagasForm";

import { PlusIcon } from "../icons"; // Ícone para os botões de cadastro

// Importa estilos de módulos específicos
import cardsStyles from "../Cards/Cards.module.css"; // Para cards gerais e placeholders
// import professionalsStyles from "../Professionals/Professionals.module.css"; // Para estilos de profissionais
// import clientsStyles from "../Clients/Clients.module.css"; // Para estilos de clientes
// import vagasStyles from "../Vagas/Vagas.module.css"; // Para estilos de vagas

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeSection,
}) => {
  // const [showProfessionalForm, setShowProfessionalForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showVagasForm, setShowVagasForm] = useState(false);

  const renderSectionContent = () => {
    switch (activeSection) {
      case "Dashboard": // Seção principal de Dashboard/Visão Geral
        return (
          <>
            <div className={cardsStyles.cardsGrid}>
              <PerformanceOverviewCard />
              <RecentActivityCard />
              <div className={cardsStyles.placeholderCard}>
                <p>Visão Geral de Vagas</p>{" "}
                {/* Este card permanece aqui como parte do overview */}
              </div>
            </div>
          </>
        );
      case "Atividade": // Seção dedicada à Atividade com seu próprio submenu
        return <ActivitySection />;
      case "Clientes":
        return (
          <>
            <button
              className="buttonPrimary"
              onClick={() => setShowClientForm(true)}
            >
              <PlusIcon />
              Cadastrar Cliente
            </button>
            <ClientList />
            {showClientForm && (
              <ClientForms onClose={() => setShowClientForm(false)} />
            )}
          </>
        );
      case "Profissionais":
        return (
          <>
            <button className="buttonPrimary">
              <PlusIcon />
              Cadastrar Profissional
            </button>
            <ProfessionalsList />
            {/* showProfessionalForm && (
               <ProfessionalsForm onClose={() => setShowProfessionalForm(false)} />
            )*/}
          </>
        );
      case "Vagas":
        return (
          <>
            <button
              className="buttonPrimary"
              onClick={() => setShowVagasForm(true)}
            >
              <PlusIcon />
              Cadastrar Vaga
            </button>
            <VagasList />
            {showVagasForm && (
              <VagasForm onClose={() => setShowVagasForm(false)} />
            )}
          </>
        );
      case "Agenda":
        return (
          <div
            className={cardsStyles.placeholderCard}
            style={{ marginTop: "32px" }}
          >
            <p>Conteúdo da seção Agenda (detalhado)</p>
          </div>
        );
      case "Entrevistas":
        return (
          <div
            className={cardsStyles.placeholderCard}
            style={{ marginTop: "32px" }}
          >
            <p>Conteúdo da seção Entrevistas (detalhado)</p>
          </div>
        );
      case "Testes":
        return (
          <div
            className={cardsStyles.placeholderCard}
            style={{ marginTop: "32px" }}
          >
            <p>Conteúdo da seção Testes</p>
          </div>
        );
      case "Configurações":
        return (
          <div
            className={cardsStyles.placeholderCard}
            style={{ marginTop: "32px" }}
          >
            <p>Conteúdo da seção Configurações</p>
          </div>
        );
      default:
        return (
          <div
            className={cardsStyles.placeholderCard}
            style={{ marginTop: "32px" }}
          >
            <p>Seção não encontrada. Selecione uma opção no menu lateral.</p>
          </div>
        );
    }
  };

  return <>{renderSectionContent()}</>;
};

export default DashboardContent;
