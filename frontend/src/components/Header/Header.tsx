// frontend/components/Header/Header.tsx
import React from "react";
import styles from "./Header.module.css"; // Importa o módulo CSS
import { BellIcon, SearchIcon } from "../icons"; // Importa os ícones
import Image from "next/image";
import Link from "next/link";

const Header: React.FC = () => {
  const [uid, setUid] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setUid(localStorage.getItem("uid"));
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.searchBar}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Pesquisar..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.headerActions}>
        <Link href="/take-it" className="buttonPrimary">
          <SearchIcon />
          TAKE IT
        </Link>
        <button className={styles.iconButton}>
          <BellIcon />
        </button>
        <Link href={`/profile/${uid}`}>
          <Image
            src="https://placehold.co/40x40/FFD700/000000?text=JD"
            width={30}
            height={30}
            alt="User Avatar"
            className={styles.userAvatar}
            unoptimized
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
