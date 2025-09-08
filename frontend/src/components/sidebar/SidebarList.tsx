import {
  BriefcaseIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  EmployeesIcon,
  HandshakeIcon,
  SettingsIcon,
  UsersIcon,
} from '../icons';

// Recebe o usuário como parâmetro para montar o menu dinamicamente
export const getNavItems = (user: any) => {
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
  ];

  // Adiciona o item "Funcionarios" apenas se o usuário for ADMIN_SISTEMA
  if (user?.tipo === 'ADMIN_SISTEMA') {
    navItems.push({
      icon: <EmployeesIcon className="w-5 h-5 text-inherit" />,
      label: 'Funcionarios',
      href: `/funcionarios`,
    });
  }

  return navItems;
};
