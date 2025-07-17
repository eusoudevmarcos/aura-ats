import React from 'react';
import styles from './Sidebar.module.css'; // Importa o módulo CSS

interface SidebarItemProps {
  icon: React.ReactNode; // Pode ser um ícone SVG ou outro componente React
  label: string;
  active: boolean;
  onClick: () => void;
  isDropdownItem?: boolean; // Adicionado para diferenciar itens de dropdown
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, isDropdownItem = false }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.sidebarItem} ${active ? styles.sidebarItemActive : ''} ${isDropdownItem ? styles.dropdownItem : ''}`}
    >
      {/* Renderiza o ícone diretamente. A classe 'icon' será aplicada via CSS Module no Sidebar.tsx */}
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default SidebarItem;
