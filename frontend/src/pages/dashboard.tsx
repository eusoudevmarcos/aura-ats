import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header"; // Importa o componente Header
import DashboardContent from "../components/DashboardContent/DashboardContent"; // Importa o componente de conteúdo dinâmico
import { GetServerSideProps } from "next";
import { verify } from "jsonwebtoken";
import nookies from "nookies";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  console.log("get token: "+ cookies.token);
  console.log("JWT: "+ process.env.JWT_SECRET)
  try {
    const user = verify(cookies.token, process.env.JWT_SECRET as string);
    return { props: { user } };
  } catch {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

const DashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("Atividade");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="dashboardContainer">
      {" "}
      {/* Classe global definida em globals.css */}
      {/* Sidebar */}
      <Sidebar
        setActiveSection={setActiveSection}
        activeSection={activeSection}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      {/* Conteúdo Principal (Header + Área Dinâmica) */}
      <div className="mainContentArea">
        {" "}
        {/* Classe global definida em globals.css */}
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />
        {/* Área de Conteúdo Dinâmico */}
        <main className="dashboardMainContent">
          {" "}
          {/* Classe global definida em globals.css */}
          {/* O título da seção agora reflete a seção ativa do menu principal */}
          <h1 className="sectionTitle">{activeSection}</h1>
          <DashboardContent activeSection={activeSection} />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
