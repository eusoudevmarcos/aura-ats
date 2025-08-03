import React from "react";
import SidebarItem from "./SidebarItem";
import styles from "./Sidebar.module.css";
import {
  BriefcaseIcon,
  UsersIcon,
  CalendarIcon,
  HandshakeIcon,
  ClipboardCheckIcon,
  SettingsIcon,
  ChevronDownIcon,
} from "../icons";
import Image from "next/image";

interface SidebarProps {
  setActiveSection: (section: string) => void;
  activeSection: string;
  isCollapsed: boolean;
  toggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  setActiveSection,
  activeSection,
  isCollapsed,
}) => {
  const navItems = [
    { icon: <CalendarIcon className={styles.icon} />, label: "Atividade" }, // 'Atividade' agora é um item de menu principal
    { icon: <BriefcaseIcon className={styles.icon} />, label: "Vagas" },
    { icon: <UsersIcon className={styles.icon} />, label: "Profissionais" },
    { icon: <HandshakeIcon className={styles.icon} />, label: "Clientes" },
    { icon: <HandshakeIcon className={styles.icon} />, label: "Entrevistas" }, // Pode ser um ícone diferente se tiver um específico para entrevistas
    { icon: <ClipboardCheckIcon className={styles.icon} />, label: "Testes" },
    { icon: <SettingsIcon className={styles.icon} />, label: "Configurações" },
  ];

  return (
    <aside
      className={`${styles.sidebar} ${
        isCollapsed ? styles.sidebarCollapsed : ""
      }`}
    >
      <div className={styles.sidebarLogo}>
        <Image
          height={30}
          width={30}
          src="https://placehold.co/40x40/6366F1/ffffff?text=A"
          alt="Logo Aura"
        />
        <span className={styles.sidebarLogoText}>Aura ATS</span>
      </div>

      <nav className={styles.sidebarNav}>
        {navItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeSection === item.label}
            onClick={() => setActiveSection(item.label)}
          />
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.sidebarUserCard}>
          <Image
            height={30}
            width={30}
            src="https://placehold.co/40x40/FFD700/000000?text=JD"
            alt="User Avatar"
          />
          <div className={styles.sidebarUserInfo}>
            <p>João Silva</p>
            <p>Admin</p>
          </div>
          <ChevronDownIcon className={styles.chevronDownIcon} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
