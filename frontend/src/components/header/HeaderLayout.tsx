// frontend/components/Header/Header.tsx
import logo from '@/assets/logo.svg';
import styles from '@/styles/header.module.css'; // Importa o módulo CSS
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BellIcon, SearchIcon } from '../icons'; // Importa os ícones

// Ícone de menu hamburguer simples (pode ser substituído por um SVG melhor)
const BurgerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="7" x2="21" y2="7" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="17" x2="21" y2="17" />
  </svg>
);

const HeaderLayout: React.FC = () => {
  const [uid, setUid] = React.useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setUid(localStorage.getItem('uid'));
    }
  }, []);

  // Fecha o menu ao redimensionar para desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed bg-white w-full p-4 shadow-md z-50">
      <section className="flex justify-between items-center mx-auto max-w-[1440px] gap-2">
        <Link href="/atividades/agendas">
          <Image height={0} width={50} src={logo} alt="Logo Aura" />
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
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
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden items-center">
          <button className={`${styles.iconButton} max-w-md`}>
            <BellIcon />
          </button>

          <button
            aria-label="Abrir menu"
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <BurgerIcon />
          </button>
        </div>

        {/* Menu Mobile Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-40 flex justify-end md:hidden">
            <div className="bg-white w-4/5 max-w-xs h-full shadow-lg flex flex-col p-6 relative animate-slide-in-right">
              <button
                aria-label="Fechar menu"
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
              <div className="flex flex-col gap-6 mt-8">
                <div className={styles.searchBar}>
                  <SearchIcon className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    className={styles.searchInput}
                  />
                </div>
                <Link
                  href="/take-it"
                  className="buttonPrimary flex items-center gap-2 justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <SearchIcon />
                  TAKE IT
                </Link>

                <Link
                  href={`/profile/${uid}`}
                  className="flex items-center gap-2 justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
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
            </div>
          </div>
        )}
      </section>
      {/* Animação para o menu mobile */}
      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </header>
  );
};

export default HeaderLayout;
