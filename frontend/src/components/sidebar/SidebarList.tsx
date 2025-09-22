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
  const navItems = [];

  if (
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
    user?.tipo === TipoUsuarioEnum.enum.VENDEDOR ||
    user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR
  ) {
    navItems.push({
      icon: <CalendarIcon className="w-5 h-5 text-inherit" />,
      label: 'Atividades',
      href: '/atividades/agendas',
    });
  }

  if (
    user?.tipo === TipoUsuarioEnum.enum.CLIENTE_ATS ||
    user?.tipo === TipoUsuarioEnum.enum.CLIENTE_ATS_CRM ||
    user?.tipo === TipoUsuarioEnum.enum.CLIENTE_CRM
  ) {
    navItems.push(
      {
        icon: <UsersIcon className="w-5 h-5 text-inherit" />,
        label: 'perfil',
        href: '/profile',
      },
      {
        icon: <CalendarIcon className="w-5 h-5 text-inherit" />,
        label: 'agenda',
        href: '/agenda',
      }
    );
  }

  if (user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA) {
    navItems.push({
      icon: <EmployeesIcon className="w-5 h-5 text-inherit" />,
      label: 'Usuarios do sistema',
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
    user?.tipo === TipoUsuarioEnum.enum.CLIENTE_ATS ||
    user?.tipo === TipoUsuarioEnum.enum.CLIENTE_ATS_CRM ||
    user?.tipo === TipoUsuarioEnum.enum.CLIENTE_CRM ||
    user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR
  ) {
    navItems.push({
      icon: <BriefcaseIcon className="w-5 h-5 text-inherit" />,
      label: 'Vagas',
      href: '/vagas',
    });
  }

  if (
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
    user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR
  ) {
    navItems.push(
      {
        icon: <CalendarIcon className="w-5 h-5 text-inherit" />,
        label: 'Agenda',
        href: '/agenda',
      },
      {
        icon: <HandshakeIcon className="w-5 h-5 text-inherit" />,
        label: 'Clientes',
        href: '/clientes',
      },

      {
        icon: <UsersIcon className="w-5 h-5 text-inherit" />,
        label: 'Profissionais',
        href: '/profissionais',
      },

      {
        icon: <CalendarIcon className="w-5 h-5 text-inherit" />,
        label: 'Taferas',
        href: '/tarefas',
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
