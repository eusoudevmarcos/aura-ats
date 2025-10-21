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

  // if (
  //   user?.tipo === TipoUsuarioEnum.enum.CLIENTE_ATS ||
  //   user?.tipo === TipoUsuarioEnum.enum.CLIENTE_ATS_CRM ||
  //   user?.tipo === TipoUsuarioEnum.enum.CLIENTE_CRM
  // ) {
  //   navItems.push(
  //     {
  //       icon: <UsersIcon className="w-5 h-5 text-inherit" />,
  //       label: 'perfil',
  //       href: '/profile',
  //     },
  //     {
  //       icon: <CalendarIcon className="w-5 h-5 text-inherit" />,
  //       label: 'agenda',
  //       href: '/agenda',
  //     }
  //   );
  // }

  // if (user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA) {
  //   navItems.push({
  //     icon: (
  //       <span className="material-icons-outlined w-5 h-5 text-inherit">
  //         credit_card
  //       </span>
  //     ),
  //     label: 'Planos',
  //     href: `/planos`,
  //   });
  // }

  // if (
  //   user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
  //   user?.tipo === TipoUsuarioEnum.enum.VENDEDOR
  // ) {
  //   navItems.push({
  //     icon: <UsersIcon className="w-5 h-5 text-inherit" />,
  //     label: 'Prospecções',
  //     href: '/prospeccoes/',
  //   });
  // }

  navItems.push(
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
      user?.tipo === TipoUsuarioEnum.enum.VENDEDOR ||
      user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR
      ? {
          icon: <CalendarIcon className="w-5 h-5 text-inherit" />,
          label: 'Atividades',
          href: '/atividades/agendas',
        }
      : undefined,
    {
      icon: <UsersIcon className="w-5 h-5 text-inherit" />,
      label: 'Profissionais',
      href: '/profissionais',
    },
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
      user?.tipo === TipoUsuarioEnum.enum.CLIENTE_ATS ||
      user?.tipo === TipoUsuarioEnum.enum.CLIENTE_ATS_CRM ||
      user?.tipo === TipoUsuarioEnum.enum.CLIENTE_CRM ||
      user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR
      ? {
          icon: <BriefcaseIcon className="w-5 h-5 text-inherit" />,
          label: 'Vagas',
          href: '/vagas',
        }
      : undefined,
    {
      icon: <HandshakeIcon className="w-5 h-5 text-inherit" />,
      label: 'Entrevistas',
      href: '/entrevistas',
    },
    {
      icon: <CalendarIcon className="w-5 h-5 text-inherit" />,
      label: 'Agenda',
      href: '/agenda',
    },
    {
      icon: <span className="material-icons-outlined">task</span>,
      label: 'Taferas',
      href: '/tarefas',
    },
    {
      icon: <HandshakeIcon className="w-5 h-5 text-inherit" />,
      label: 'Clientes',
      href: '/clientes',
    },
    {
      icon: <ClipboardCheckIcon className="w-5 h-5 text-inherit" />,
      label: 'Testes',
      href: '/testes',
    },
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA
      ? {
          icon: (
            <span className="material-icons-outlined w-5 h-5 text-inherit">
              credit_card
            </span>
          ),
          label: 'Planos',
          href: `/planos`,
        }
      : undefined,
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA
      ? {
          icon: <EmployeesIcon className="w-5 h-5 text-inherit" />,
          label: 'Usuarios do sistema',
          href: `/funcionarios`,
        }
      : undefined
  );

  return navItems;
};
