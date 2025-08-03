import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header"; // Importa o componente Header
import { GetServerSideProps } from "next";
import { verify } from "jsonwebtoken";
import nookies from "nookies";

interface Children {
  activeSection?: string;
}

interface Props {
  children: React.ReactNode | ((props: Children) => React.ReactNode);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);

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

function DashboardLayout({ children }: Props) {
  const [activeSection, setActiveSection] = useState("");
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
        setActiveSection={(section: string) => setActiveSection(section)}
        activeSection={activeSection ?? ""}
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
          {typeof children === "function"
            ? children({ activeSection })
            : children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
