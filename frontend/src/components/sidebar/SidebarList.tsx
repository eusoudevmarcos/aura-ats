import { TipoUsuarioEnum } from '@/schemas/funcionario.schema';
import {
  BriefcaseIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  EmployeesIcon,
  HandshakeIcon,
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
  ];

  if (user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA) {
    navItems.push({
      icon: <EmployeesIcon className="w-5 h-5 text-inherit" />,
      label: 'Funcionarios',
      href: `/funcionarios`,
    });
  }

  if (
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
    user?.tipo === TipoUsuarioEnum.enum.VENDEDOR
  ) {
    navItems.push({
      icon: <UsersIcon className="w-5 h-5 text-inherit" />,
      label: 'Prospecções',
      href: '/prospeccoes/',
    });
  }

  if (
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
    user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR
  ) {
    navItems.push(
      {
        icon: <BriefcaseIcon className="w-5 h-5 text-inherit" />,
        label: 'Vagas',
        href: '/vagas',
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
      }
    );
  }

  return navItems;
};
