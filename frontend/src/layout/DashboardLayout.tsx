import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import Header from "@/components/Header/Header";
interface Children {
  activeSection?: string;
}

interface Props {
  children: React.ReactNode | ((props: Children) => React.ReactNode);
}
interface UserData {
  id: string;
  name: string;
  role?: string;
  // demais campos do token
}

interface DashboardProps {
  user: UserData;
  children: React.ReactNode | ((data: any) => void);
}

const DashboardLayout: React.FC<DashboardProps> = ({ children, user }) => {
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
