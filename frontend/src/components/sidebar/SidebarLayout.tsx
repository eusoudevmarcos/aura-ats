import { useUser } from '@/hook/useUser';
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
      icon: <CalendarIcon className="w-5 h-5 text-inherit" />,
      label: 'Atividade',
      href: '/atividades/agendas',
    },
    {
      icon: <BriefcaseIcon className="w-5 h-5 text-inherit" />,
      label: 'Vagas',
      href: '/vagas',
    },
    {
      icon: <UsersIcon className="w-5 h-5 text-inherit" />,
      label: 'Prospecções',
      href: '/prospeccoes/',
    },
    {
      icon: <UsersIcon className="w-5 h-5 text-inherit" />,
      label: 'Profissionais',
      href: '/profissionais',
    },
    {
      icon: <HandshakeIcon className="w-5 h-5 text-inherit" />,
      label: 'Clientes',
      href: '/clientes',
    },
    {
      icon: <HandshakeIcon className="w-5 h-5 text-inherit" />,
      label: 'Entrevistas',
      href: '/entrevistas',
    },
    {
      icon: <ClipboardCheckIcon className="w-5 h-5 text-inherit" />,
      label: 'Testes',
      href: '/testes',
    },
    {
      icon: <SettingsIcon className="w-5 h-5 text-inherit" />,
      label: 'Configurações',
      href: '/configuracoes',
    },
    {
      icon: <EmployeesIcon className="w-5 h-5 text-inherit" />,
      label: 'Funcionarios',
      href: `/funcionarios`,
    },
  ];

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className={`hidden fixed top-24 left-2 h-[calc(90vh-2rem)] bg-white text-[#474747] md:flex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out z-40 ${
          collapsed ? 'w-20 p-5 items-center' : 'w-64 p-6'
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer absolute right-[-20px] top-12 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-30 border border-gray-200"
        >
          {collapsed ? <ListIcon /> : <ListClosedIcon />}
        </button>

        {/* Navegação */}
        <nav className="flex-grow flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          <ul>
            {navItems.map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left border-0 cursor-pointer ${
                    router.pathname === item.href
                      ? 'bg-[#f1eefe] text-[#7839cd] shadow-md'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  } ${collapsed ? 'justify-center px-3' : ''}`}
                  onMouseEnter={() => setIsShowLabel(true)}
                  onMouseLeave={() => setIsShowLabel(false)}
                >
                  <p>{item.icon}</p>
                  <span
                    className={`whitespace-nowrap overflow-hidden transition duration-100 ${
                      collapsed && 'hidden w-0'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Usuário */}
        <Link
          href={`/profile`}
          className={`flex items-center gap-2 mt-auto p-2 rounded-md hover:bg-gray-100 transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Image
            height={40}
            width={40}
            src={`https://placehold.co/40x40/FFD700/000000?text=${getFirstLetter(
              user?.nome || user?.razaoSocial
            )}`}
            alt="User Avatar"
            unoptimized
            className="rounded-full object-cover flex-shrink-0"
          />
          <div
            className={`flex-grow whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
              collapsed ? 'opacity-0 w-0' : 'opacity-100 ml-2'
            }`}
          >
            <p className="text-sm font-medium truncate">
              {user?.nome || user?.razaoSocial}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-500 truncate">{user.tipo}</p>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 text-gray-400 transition-all duration-300 ${
              collapsed ? 'hidden' : 'block'
            }`}
          />
        </Link>
      </aside>

      {/* Sidebar Mobile */}
      <div className="fixed top-24 left-2 h-[calc(90vh-2rem)] z-40 md:hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer absolute right-[-22px] top-30 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-50 border border-gray-200"
        >
          {collapsed ? <ListIcon /> : <ListClosedIcon />}
        </button>
        <aside
          className={`bg-white text-[#474747] h-[calc(90vh-2rem)] flex flex-col shadow-lg rounded-lg transition-all duration-300 ease-in-out z-40 ${
            collapsed ? 'w-0 p-0' : 'w-64 p-6'
          }`}
        >
          <nav className="flex-grow flex flex-col gap-2 overflow-y-auto custom-scrollbar">
            <ul>
              {navItems.map(item => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left border-0 cursor-pointer ${
                      router.pathname === item.href
                        ? 'bg-[#f1eefe] text-[#7839cd] shadow-md'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                    onMouseEnter={() => setIsShowLabel(true)}
                    onMouseLeave={() => setIsShowLabel(false)}
                  >
                    {item.icon}
                    <span
                      className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                        collapsed ? 'opacity-0 w-0' : 'opacity-100'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href={`/profile`}
            className={`flex items-center gap-2 mt-auto p-2 rounded-md hover:bg-gray-100 transition-all duration-200 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <Image
              height={40}
              width={40}
              src={`https://placehold.co/40x40/FFD700/000000?text=${getFirstLetter(
                user?.nome || user?.razaoSocial
              )}`}
              alt="User Avatar"
              unoptimized
              className="rounded-full object-cover flex-shrink-0"
            />
            <div
              className={`flex-grow whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                collapsed ? 'opacity-0 w-0' : 'opacity-100 ml-2'
              }`}
            >
              <p className="text-sm font-medium truncate">
                {user?.nome || user?.razaoSocial}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <p className="text-xs text-gray-500 truncate">{user.tipo}</p>
            </div>
            <ChevronDownIcon
              className={`w-4 h-4 text-gray-400 transition-all duration-300 ${
                collapsed ? 'hidden' : 'block'
              }`}
            />
          </Link>
        </aside>
      </div>
    </>
  );
};

export default SidebarLayout;
