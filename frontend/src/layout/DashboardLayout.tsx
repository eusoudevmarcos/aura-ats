import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header"; // Importa o componente Header
interface Children {
  activeSection?: string;
}

interface Props {
  children: React.ReactNode | ((props: Children) => React.ReactNode);
}

function DashboardLayout({ children }: Props) {
  const [activeSection, setActiveSection] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="dashboardContainer">
      <Sidebar
        setActiveSection={(section: string) => setActiveSection(section)}
        activeSection={activeSection ?? ""}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <div className="mainContentArea">
        <Header toggleSidebar={toggleSidebar} />
        <main className="dashboardMainContent">
          {typeof children === "function"
            ? children({ activeSection })
            : children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
