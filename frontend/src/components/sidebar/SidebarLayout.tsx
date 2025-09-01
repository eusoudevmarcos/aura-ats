import { useUser } from '@/hook/useUser';
import styles from '@/styles/sidebar.module.css';
import { getFirstLetter } from '@/utils/getFirstLetter';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  BriefcaseIcon,
  CalendarIcon,
  ChevronDownIcon,
  ClipboardCheckIcon,
  EmployeesIcon,
  HandshakeIcon,
  ListClosedIcon,
  ListIcon,
  SettingsIcon,
  UsersIcon,
} from '../icons';

interface SidebarProps {
  onToggleSidebar: (collapsed: boolean) => void;
}

const SidebarLayout: React.FC<SidebarProps> = ({ onToggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [isShowLabel, setIsShowLabel] = useState(false);
  const router = useRouter();
  const user = useUser();

  // Sempre colapsa o menu ao trocar de rota
  useEffect(() => {
    setCollapsed(true);
  }, [router.pathname]);

  useEffect(() => {
    onToggleSidebar(collapsed);
  }, [collapsed, onToggleSidebar]);

  if (!user) return null;

  const navItems = [
    {
      icon: <CalendarIcon className={styles.icon} />,
      label: 'Atividade',
      href: '/atividades/agendas',
    },
    {
      icon: <BriefcaseIcon className={styles.icon} />,
      label: 'Vagas',
      href: '/vagas',
    },
    {
      icon: <UsersIcon className={styles.icon} />,
      label: 'Prospecções',
      href: '/prospeccoes/',
    },
    {
      icon: <UsersIcon className={styles.icon} />,
      label: 'Profissionais',
      href: '/profissionais',
    },
    {
      icon: <HandshakeIcon className={styles.icon} />,
      label: 'Clientes',
      href: '/clientes',
    },
    {
      icon: <HandshakeIcon className={styles.icon} />,
      label: 'Entrevistas',
      href: '/entrevistas',
    },
    {
      icon: <ClipboardCheckIcon className={styles.icon} />,
      label: 'Testes',
      href: '/testes',
    },
    {
      icon: <SettingsIcon className={styles.icon} />,
      label: 'Configurações',
      href: '/configuracoes',
    },
    {
      icon: <EmployeesIcon className={styles.icon} />,
      label: 'Funcionarios',
      href: '/funcionarios/',
    },
  ];

  return (
    <>
      <aside
        className={`hidden fixed top-24 left-2 h-[calc(90vh-2rem)] bg-white text-primary md:flex flex-col shadow-lg rounded-lg
        transition-all duration-300 ease-in-out z-40  ${
          collapsed ? 'w-20 p-5' : 'w-64 p-6'
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer absolute right-[-20px] top-12 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-30 border border-gray-200"
        >
          {collapsed ? <ListIcon /> : <ListClosedIcon />}
        </button>

        <nav className="flex-grow overflow-y-auto custom-scrollbar">
          <ul>
            {navItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left border-0 cursor-pointer ${
                  router.pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-neutral hover:text-primary'
                }`}
                onMouseEnter={() => setIsShowLabel(true)}
                onMouseLeave={() => setIsShowLabel(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </ul>
        </nav>
        <Link
          href={`/profile/${user.id}`}
          className={`flex items-center gap-2 mt-auto p-2 rounded-md hover:bg-gray-100 ${
            collapsed ? 'justify-center' : ''
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

      <div className="fixed top-24 left-2 h-[calc(90vh-2rem)] z-40 md:hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer absolute right-[-22px] top-30 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-50 border border-gray-200"
        >
          {collapsed ? <ListIcon /> : <ListClosedIcon />}
        </button>
        <aside
          className={`bg-white text-primary h-[calc(90vh-2rem)] flex flex-col shadow-lg rounded-lg
        transition-all duration-300 ease-in-out z-40 ${
          collapsed ? 'w-0 p-0' : 'w-64 p-6'
        }`}
        >
          <nav className="flex-grow overflow-y-auto custom-scrollbar">
            <ul>
              {navItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left border-0 cursor-pointer ${
                    router.pathname === item.href
                      ? 'bg-primary text-white'
                      : 'text-primary hover:bg-neutral hover:text-primary'
                  }`}
                  onMouseEnter={() => setIsShowLabel(true)}
                  onMouseLeave={() => setIsShowLabel(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </ul>
          </nav>
          <Link
            href={`/profile/${user.id}`}
            className={`flex items-center gap-2 mt-auto p-2 rounded-md hover:bg-gray-100 ${
              collapsed ? 'justify-center' : ''
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
            {!collapsed && (
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            )}
          </Link>
        </aside>
      </div>
    </>
  );
};

export default SidebarLayout;
