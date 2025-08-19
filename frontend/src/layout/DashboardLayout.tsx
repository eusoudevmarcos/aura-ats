import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";

interface DashboardProps {
  children: React.ReactNode | ((data: any) => void);
}

const DashboardLayout: React.FC<DashboardProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState("");

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const onToggleSidebar = (collapsedState: boolean) => {
    setIsSidebarCollapsed(collapsedState);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Sidebar onToggleSidebar={onToggleSidebar} />

      <Header />

      <div
        className={`flex-1 overflow-auto transition-all duration-300
          ${isSidebarCollapsed ? "pl-28" : "pl-72"} pt-4 pr-4`}
      >
        <main className="p-2 rounded-lg">
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
