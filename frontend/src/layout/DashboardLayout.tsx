import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";

interface DashboardProps {
  children: React.ReactNode | ((data: any) => void);
}

const DashboardLayout: React.FC<DashboardProps> = ({ children }) => {
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
            ? children({ activeSection }) ?? null
            : React.isValidElement(children)
            ? children
            : null}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
