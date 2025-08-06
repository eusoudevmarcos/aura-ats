import React, { useEffect, useState } from "react";
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
import nookies from "nookies";
import Link from "next/link";

interface SidebarProps {
  setActiveSection: (section: string) => void;
  activeSection: string;
  isCollapsed: boolean;
  toggleSidebar?: () => void;
}

// pages/dashboard.tsx
const Sidebar: React.FC<SidebarProps> = ({
  setActiveSection,
  activeSection,
  isCollapsed,
}) => {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("uid");
    setUid(storedToken);
  }, []);

  if (!uid) return <p>Carregando...</p>;

  const navItems = [
    {
      icon: <CalendarIcon className={styles.icon} />,
      label: "Atividade",
      href: "/atividades/agendas",
    }, // 'Atividade' agora é um item de menu principal
    {
      icon: <BriefcaseIcon className={styles.icon} />,
      label: "Vagas",
      href: "/vagas",
    },
    {
      icon: <UsersIcon className={styles.icon} />,
      label: "Profissionais",
      href: "/profissionais",
    },
    {
      icon: <HandshakeIcon className={styles.icon} />,
      label: "Clientes",
      href: "/clientes",
    },
    {
      icon: <HandshakeIcon className={styles.icon} />,
      label: "Entrevistas",
      href: "/entrevistas",
    }, // Pode ser um ícone diferente se tiver um específico para entrevistas
    {
      icon: <ClipboardCheckIcon className={styles.icon} />,
      label: "Testes",
      href: "/testes",
    },
    {
      icon: <SettingsIcon className={styles.icon} />,
      label: "Configurações",
      href: "/configuracoes",
    },
    {
      icon: <SettingsIcon className={styles.icon} />,
      label: "Perfil",
      href: "/profile/" + uid,
    },
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
          unoptimized
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
            href={item.href}
            onClick={() => setActiveSection(item.label)}
          />
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <Link href={"/profile/" + uid} className={styles.sidebarUserCard}>
          <Image
            height={30}
            width={30}
            src="https://placehold.co/40x40/FFD700/000000?text=JD"
            alt="User Avatar"
            unoptimized
          />
          <div className={styles.sidebarUserInfo}>
            <p>João Silva</p>
            <p>Admin</p>
          </div>
          <ChevronDownIcon className={styles.chevronDownIcon} />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
