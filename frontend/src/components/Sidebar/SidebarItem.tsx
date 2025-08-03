import React from "react";
import styles from "./Sidebar.module.css"; // Importa o módulo CSS
import Link from "next/link";

interface SidebarItemProps {
  icon: React.ReactNode; // Pode ser um ícone SVG ou outro componente React
  label: string;
  active: boolean;
  href: string;
  onClick: () => void;
  isDropdownItem?: boolean; // Adicionado para diferenciar itens de dropdown
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  onClick,
  href,
  isDropdownItem = false,
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${styles.sidebarItem} ${
        active ? styles.sidebarItemActive : ""
      } ${isDropdownItem ? styles.dropdownItem : ""}`}
    >
      {/* Renderiza o ícone diretamente. A classe 'icon' será aplicada via CSS Module no Sidebar.tsx */}
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default SidebarItem;
