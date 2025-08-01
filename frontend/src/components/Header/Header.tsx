// frontend/components/Header/Header.tsx
import React from "react";
import styles from "./Header.module.css"; // Importa o módulo CSS
import { BellIcon, SearchIcon } from "../icons"; // Importa os ícones
import { ListIcon } from "../icons/ListIcon"; // Importa um novo ícone para o toggle da sidebar
import Image from "next/image";

interface HeaderProps {
  toggleSidebar: () => void; // Adicionado: A propriedade toggleSidebar
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className={styles.header}>
      {/* Botão para recolher/expandir a sidebar */}
      <button onClick={toggleSidebar} className={styles.sidebarToggleButton}>
        <ListIcon /> {/* Ícone para o botão de toggle */}
      </button>

      {/* Barra de Pesquisa */}
      <div className={styles.searchBar}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Pesquisar..."
          className={styles.searchInput}
        />
      </div>

      {/* Botões de Ação e Perfil */}
      <div className={styles.headerActions}>
        <button className={styles.createButton}>
          <SearchIcon />
          TAKE IT
        </button>
        <button className={styles.iconButton}>
          <BellIcon />
        </button>
        <Image
          src="https://placehold.co/40x40/FFD700/000000?text=JD"
          width={30}
          height={30}
          alt="User Avatar"
          className={styles.userAvatar}
        />
      </div>
    </header>
  );
};

export default Header;
