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
  ListIcon,
  ListClosedIcon,
} from "../icons";
import Image from "next/image";
import { useUser } from "@/hook/useUser";
import { getFirstLetter } from "@/utils/getFirstLetter";
import Link from "next/link";
import { useRouter } from "next/router";

interface SidebarProps {
  onToggleSidebar: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    onToggleSidebar(collapsed);
  }, [collapsed, onToggleSidebar]);

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
      className={`fixed top-20 left-4 h-[calc(90vh-2rem)] bg-white text-[#474747] flex flex-col shadow-lg rounded-lg
        transition-all duration-300 ease-in-out z-40 ${
          collapsed ? "w-20 p-5" : "w-64 p-6"
        }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="cursor-pointer absolute right-[-15px] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-30 border border-gray-200"
      >
        {collapsed ? <ListIcon /> : <ListClosedIcon />}
      </button>

      <div
        className={`flex items-center gap-2 mb-8 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <Image
          height={30}
          width={30}
          src="https://placehold.co/40x40/6366F1/ffffff?text=A"
          alt="Logo Aura"
          unoptimized
        />
        {!collapsed && (
          <span className="text-xl font-semibold text-gray-800">Aura ATS</span>
        )}
      </div>

      <nav className="flex-grow overflow-y-auto custom-scrollbar">
        <ul>
          {navItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={router.pathname === item.href}
              href={item.href}
            />
          ))}
        </ul>
      </nav>

      <Link
        href={`/profile/${user.id}`}
        className={`flex items-center gap-2 mt-auto p-2 rounded-md hover:bg-gray-100 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <Image
          height={30}
          width={30}
          src={`https://placehold.co/40x40/FFD700/000000?text=${getFirstLetter(
            user?.nome || user?.razaoSocial
          )}`}
          alt="User Avatar"
          unoptimized
          className="rounded-full"
        />
        {!collapsed && (
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">
              {user?.nome || user?.razaoSocial}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-500 truncate">{user.tipo}</p>
          </div>
        )}
        {!collapsed && <ChevronDownIcon className="w-4 h-4 text-gray-400" />}
      </Link>
    </aside>
  );
};

export default Sidebar;
