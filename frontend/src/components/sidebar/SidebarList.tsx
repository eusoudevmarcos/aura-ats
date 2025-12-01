import { TipoUsuarioEnum } from '@/schemas/funcionario.schema';
import {
  BriefcaseIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  EmployeesIcon,
} from '../icons';

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
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
    user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR
  ) {
    navItems.push({
      icon: <span className="material-icons-outlined">person</span>,
      label: 'Profissionais',
      href: '/profissionais',
    });
  }

  if (
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
    user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR ||
    user?.tipo === TipoUsuarioEnum.enum.VENDEDOR
  ) {
    navItems.push({
      icon: <span className="material-icons-outlined p-0 m-0">group</span>,
      label: 'Clientes',
      href: '/clientes',
    });
  }

  if (
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
    user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR
  ) {
    navItems.push({
      icon: <BriefcaseIcon className="w-5 h-5 text-inherit" />,
      label: 'Vagas',
      href: '/vagas',
    });
  }

  // navItems.push({
  //   icon: <HandshakeIcon className="w-5 h-5 text-inherit" />,
  //   label: 'Entrevistas',
  //   href: '/entrevistas',
  // });

  if (user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA) {
    navItems.push({
      icon: <span className="material-icons-outlined">task</span>,
      label: 'Taferas',
      href: '/tarefas',
    });
  }

  if (
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
    user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR ||
    user?.tipo === TipoUsuarioEnum.enum.CLIENTE
  ) {
    navItems.push({
      icon: <CalendarIcon className="w-5 h-5 text-inherit" />,
      label: 'Agenda',
      href: '/agenda',
    });
  }

  if (user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA) {
    navItems.push({
      icon: <ClipboardCheckIcon className="w-5 h-5 text-inherit" />,
      label: 'Testes',
      href: '/testes',
    });
  }

  if (user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA) {
    navItems.push({
      icon: (
        <span className="material-icons-outlined w-5 h-5 text-inherit">
          credit_card
        </span>
      ),
      label: 'Planos',
      href: `/planos`,
    });
  }

  if (user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA) {
    navItems.push({
      icon: <EmployeesIcon className="w-5 h-5 text-inherit" />,
      label: 'Usuarios do sistema',
      href: `/funcionarios`,
    });
  }

  return navItems;
};
