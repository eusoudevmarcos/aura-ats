import Header from '@/components/header/Header';
import 'material-icons/iconfont/material-icons.css';
import React, { useState } from 'react';
import Sidebar from '../components/sidebar';

interface DashboardProps {
  children: React.ReactNode | ((data: any) => void);
}

const DashboardLayout: React.FC<DashboardProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState('');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const onToggleSidebar = (collapsedState: boolean) => {
    setIsSidebarCollapsed(collapsedState);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Sidebar onToggleSidebar={onToggleSidebar} />

      <Header />

      <div
        className={`flex-1 overflow-auto transition-all duration-300
          ${
            isSidebarCollapsed
              ? 'md:pl-28 min-[1640px]:pl-0'
              : 'md:pl-72 min-[1940px]:pl-0'
          } pt-4 md:pr-4`}
      >
        <main className="p-2 rounded-lg mt-18 mx-auto max-w-[1440px]">
          {typeof children === 'function'
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
