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
import Link from "next/link";
import { useUser } from "@/hook/useUser";
import { getFirstLetter } from "@/utils/getFirstLetter";

interface UserData {
  id: string;
  name: string;
  role?: string;
}

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
  const user = useUser();
  if (!user) return null;

  const navItems = [
    {
      icon: <CalendarIcon className={styles.icon} />,
      label: "Atividade",
      href: "/atividades/agendas",
    },
    {
      icon: <BriefcaseIcon className={styles.icon} />,
      label: "Vagas",
      href: "/vagas",
    },
    {
      icon: <UsersIcon className={styles.icon} />,
      label: "Prospecções",
      href: "/prospeccoes/",
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
    },
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
      href: `/profile/${user.uid}`,
    },
    {
      icon: <SettingsIcon className={styles.icon} />,
      label: "Funcionarios",
      href: "/funcionarios/",
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

      <Link href={`/profile/${user.id}`} className={styles.sidebarUserCard}>
        <Image
          height={30}
          width={30}
          src={`https://placehold.co/40x40/FFD700/000000?text=${getFirstLetter(
            user?.nome || user?.razaoSocial
          )}`}
          alt="User Avatar"
          unoptimized
        />
        <div className={styles.sidebarUserInfo}>
          <p>{user?.nome || user?.razaoSocial}</p>
          <p>{user.email}</p>
          <p>{user.tipo}</p>
        </div>
        <ChevronDownIcon className={styles.chevronDownIcon} />
      </Link>
    </aside>
  );
};

export default Sidebar;
