import { ModalVideoRM } from '@/components/modal/ModalVideoRM';
import Button from '@/components/site/Button/Button';
import { useSmoothScroll } from '@/hook/useSmoothScroll';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

// Botão Entrar isolado
type EntrarButtonProps = {
  onClick: () => void;
  mode?: 'desktop' | 'mobile';
  className?: string;
};
const EntrarButton: React.FC<EntrarButtonProps> = ({
  onClick,
  mode = 'desktop',
  className = '',
}) => {
  if (mode === 'mobile') {
    return (
      <Button
        variant="primary"
        size="medium"
        onClick={onClick}
        className={
          'flex items-center justify-center gap-2 px-4 py-2 border-2 border-[var(--whatsapp-green)] rounded-md bg-[var(--whatsapp-green)] text-[var(--secondary-color)] font-semibold text-base ' +
          className
        }
      >
        Entrar
      </Button>
    );
  }

  // desktop
  return (
    <Button
      variant="outlined"
      size="medium"
      onClick={onClick}
      className={
        'bg-transparent border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-semibold rounded px-3 py-1.5 ' +
        'hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors ' +
        className
      }
    >
      Entrar
    </Button>
  );
};

// Submenu isolado para Desktop e Mobile
type ServicesSubMenuProps = {
  mode: 'desktop' | 'mobile';
  isOpen: boolean;
  onSectionClick: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    sectionId: string
  ) => void;
  openModalVideoRM: () => void;
  style?: React.CSSProperties;
};

const ServicesSubMenu: React.FC<ServicesSubMenuProps> = ({
  mode,
  isOpen,
  onSectionClick,
  openModalVideoRM,
  style,
}) => {
  if (mode === 'desktop') {
    return (
      <ul
        className={`
          absolute left-0 mt-2 bg-white rounded-lg shadow-lg py-2 opacity-0 group-hover:opacity-100 group-hover:visible transition duration-150 z-20 invisible
        `}
        style={style}
      >
        <li>
          <Link
            href="#service-plataforma"
            className="block px-5 py-2 text-[var(--text-color-primary)] hover:bg-[var(--primary-color-light)] hover:text-[var(--primary-color)] transition"
            onClick={e => {
              onSectionClick(e, 'service-plataforma');
              openModalVideoRM();
            }}
          >
            Plataforma
          </Link>
        </li>
        <li>
          <Link
            href="#pricing-section"
            className="block px-5 py-2 text-[var(--text-color-primary)] hover:bg-[var(--primary-color-light)] hover:text-[var(--primary-color)] transition"
            onClick={e => {
              onSectionClick(e, 'pricing-section');
            }}
          >
            Recrutamento Médico
          </Link>
        </li>
        <li>
          <Link
            href="#recrutamento_diversos"
            className="block px-5 py-2 text-[var(--text-color-primary)] hover:bg-[var(--primary-color-light)] hover:text-[var(--primary-color)] transition text-nowrap"
            onClick={e => onSectionClick(e, 'recrutamento_diversos')}
          >
            Recrutamento Diversos
          </Link>
        </li>
      </ul>
    );
  }

  // MOBILE
  return (
    <ul
      id="mobile-services-submenu"
      className={`flex flex-col gap-1 mt-1 transition-[max-height,opacity] duration-200 overflow-hidden rounded-lg shadow bg-white text-[var(--text-color-primary)] ${
        isOpen
          ? 'max-h-60 opacity-100 py-2 px-2 pointer-events-auto'
          : 'max-h-0 opacity-0 py-0 px-2 pointer-events-none'
      }`}
      style={{ zIndex: 100, ...style }}
    >
      <li>
        <Link
          href="#service-medico"
          className="block text-right px-5 py-2 hover:bg-[var(--primary-color-light)] hover:text-[var(--primary-color)] transition"
          onClick={e => onSectionClick(e, 'service-medico')}
        >
          Médico
        </Link>
      </li>
      <li>
        <Link
          href="#service-plataforma"
          className="block text-right px-5 py-2 hover:bg-[var(--primary-color-light)] hover:text-[var(--primary-color)] transition"
          onClick={e => onSectionClick(e, 'service-plataforma')}
        >
          Plataforma
        </Link>
      </li>
      <li>
        <Link
          href="#service-recrutamento"
          className="block text-right px-5 py-2 hover:bg-[var(--primary-color-light)] hover:text-[var(--primary-color)] transition"
          onClick={e => onSectionClick(e, 'service-recrutamento')}
        >
          Recrutamento
        </Link>
      </li>
    </ul>
  );
};

// Componente isolado de navegação que adapta entre desktop e mobile
type NavLinksProps = {
  mode: 'desktop' | 'mobile';
  onSectionClick: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    sectionId: string
  ) => void;
  openModalVideoRM: () => void;
  // Desktop only (for hover de serviços)
  isServicesHovered?: boolean;
  setIsServicesHovered?: (value: boolean) => void;
  // Mobile only (para abrir/fechar submenu)
  isServicesMobileOpen?: boolean;
  setIsServicesMobileOpen?: (
    value: boolean | ((prev: boolean) => boolean)
  ) => void;
};

const NavLinks: React.FC<NavLinksProps> = ({
  mode,
  onSectionClick,
  openModalVideoRM,
  isServicesHovered,
  setIsServicesHovered,
  isServicesMobileOpen,
  setIsServicesMobileOpen,
}) => {
  if (mode === 'desktop') {
    return (
      <ul className="flex gap-8 list-none m-0 p-0">
        <li>
          <Link
            href="#platform-section"
            className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 block hover:text-[var(--primary-color)] transition-colors"
            onClick={e => onSectionClick(e, 'platform-section')}
          >
            A Plataforma
          </Link>
        </li>
        <li>
          <Link
            href="#about-section"
            className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 block hover:text-[var(--primary-color)] transition-colors"
            onClick={e => onSectionClick(e, 'about-section')}
          >
            Sobre Nós
          </Link>
        </li>
        <li
          className="relative group"
          onMouseEnter={() =>
            setIsServicesHovered && setIsServicesHovered(true)
          }
          onMouseLeave={() =>
            setIsServicesHovered && setIsServicesHovered(false)
          }
        >
          <button
            className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 hover:text-[var(--primary-color)] transition-colors flex items-center gap-1 bg-transparent border-none outline-none"
            style={{ cursor: 'pointer' }}
            onClick={e => onSectionClick(e, 'services-section')}
            type="button"
            aria-haspopup="true"
            aria-expanded={isServicesHovered}
          >
            Serviços
            <span
              className="material-icons-outlined align-middle ml-1"
              style={{ verticalAlign: 'middle' }}
            >
              {isServicesHovered ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
          </button>
          <ServicesSubMenu
            mode="desktop"
            isOpen={!!isServicesHovered}
            onSectionClick={onSectionClick}
            openModalVideoRM={openModalVideoRM}
          />
        </li>
        <li>
          <Link
            href="#pricing-section"
            className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 block hover:text-[var(--primary-color)] transition-colors"
            onClick={e => onSectionClick(e, 'pricing-section')}
          >
            Preços
          </Link>
        </li>
        <li>
          <Link
            href="#success-cases-section"
            className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 block hover:text-[var(--primary-color)] transition-colors"
            onClick={e => onSectionClick(e, 'success-cases-section')}
          >
            Cases
          </Link>
        </li>
        <li>
          <Link
            href="#contact-section"
            className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 block hover:text-[var(--primary-color)] transition-colors"
            onClick={e => onSectionClick(e, 'contact-section')}
          >
            Contato
          </Link>
        </li>
      </ul>
    );
  }

  // MOBILE
  return (
    <ul className="flex flex-col gap-3 text-right px-8">
      <li>
        <Link
          href="#platform-section"
          className="text-[var(--text-color-primary)] font-semibold text-lg py-2 block hover:text-[var(--primary-color)] transition-colors"
          onClick={e => onSectionClick(e, 'platform-section')}
        >
          A Plataforma
        </Link>
      </li>
      <li>
        <Link
          href="#about-section"
          className="text-[var(--text-color-primary)] font-semibold text-lg py-2 block hover:text-[var(--primary-color)] transition-colors"
          onClick={e => onSectionClick(e, 'about-section')}
        >
          Sobre Nós
        </Link>
      </li>
      <li className="relative flex flex-col text-right">
        <button
          className="flex items-center justify-end w-full text-[var(--text-color-primary)] font-semibold text-lg py-2 hover:text-[var(--primary-color)] transition-colors outline-none"
          onClick={() =>
            setIsServicesMobileOpen &&
            setIsServicesMobileOpen((prev: boolean) => !prev)
          }
          type="button"
          aria-expanded={isServicesMobileOpen}
          aria-controls="mobile-services-submenu"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          Serviços
          <span
            className="material-icons-outlined align-middle ml-1"
            style={{ verticalAlign: 'middle' }}
          >
            {isServicesMobileOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
          </span>
        </button>
        <ServicesSubMenu
          mode="mobile"
          isOpen={!!isServicesMobileOpen}
          onSectionClick={onSectionClick}
          openModalVideoRM={openModalVideoRM}
        />
      </li>
      <li>
        <Link
          href="#pricing-section"
          className="text-[var(--text-color-primary)] font-semibold text-lg py-2 block hover:text-[var(--primary-color)] transition-colors"
          onClick={e => onSectionClick(e, 'pricing-section')}
        >
          Preços
        </Link>
      </li>
      <li>
        <Link
          href="#success-cases-section"
          className="text-[var(--text-color-primary)] font-semibold text-lg py-2 block hover:text-[var(--primary-color)] transition-colors"
          onClick={e => onSectionClick(e, 'success-cases-section')}
        >
          Cases
        </Link>
      </li>
      <li>
        <Link
          href="#contact-section"
          className="text-[var(--text-color-primary)] font-semibold text-lg py-2 block hover:text-[var(--primary-color)] transition-colors"
          onClick={e => onSectionClick(e, 'contact-section')}
        >
          Contato
        </Link>
      </li>
    </ul>
  );
};

const HeaderLadingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);
  const [openModalVideoRM, setOpenModalVideoRM] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const { scrollToSection } = useSmoothScroll();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setIsServicesMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (!isMobile) {
        setShowMobileHeader(true);
        return;
      }

      // Se está rolando para baixo, esconde o header mobile
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowMobileHeader(false);
        setIsMenuOpen(false);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      } else {
        // Se rolou para cima, mostra o header mobile após 1s
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          setShowMobileHeader(true);
        }, 100);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    scrollToSection(sectionId, { offset: 80, duration: 800 });
    setIsMenuOpen(false);
    setIsServicesMobileOpen(false);
  };

  const handleLoginRedirect = () => {
    setIsMenuOpen(false);
    setIsServicesMobileOpen(false);
    window.location.href = process.env.NEXT_PUBLIC_NEXT_URL + '/login';
  };

  return (
    <>
      <header
        className={`
        fixed top-0 left-0 w-full z-[1000] transition-colors duration-300
        ${
          isScrolled
            ? 'bg-[var(--secondary-color)] shadow-md'
            : 'bg-[var(--secondary-color)] shadow-sm'
        }
        h-[70px] flex items-center
        transition-transform duration-500
        
      `}
        style={{
          willChange: 'transform',
        }}
      >
        <div className="max-w-[1420px] mx-auto w-full px-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer">
            <Link
              href="/"
              onClick={e =>
                handleSectionClick(
                  e as React.MouseEvent<HTMLAnchorElement>,
                  'hero-section'
                )
              }
            >
              <Image
                src="/images/auralogoh.svg"
                alt="Logo"
                width={150}
                height={50}
                priority={true}
                loading="eager"
                style={{ objectFit: 'contain', width: 150, height: 'auto' }}
              />
            </Link>
          </div>

          {/* Navegação Desktop */}
          <nav
            className={`
            hidden md:flex items-center
            ${isMenuOpen ? 'flex' : ''}
          `}
          >
            <NavLinks
              mode="desktop"
              isServicesHovered={isServicesHovered}
              setIsServicesHovered={setIsServicesHovered}
              onSectionClick={(e, sectionId) => {
                handleSectionClick(e, sectionId);
              }}
              openModalVideoRM={() => setOpenModalVideoRM(true)}
            />
          </nav>

          {/* Botão Entrar Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <EntrarButton
              onClick={handleLoginRedirect}
              mode="desktop"
              className={isScrolled ? '' : ''}
            />
          </div>

          {/* Botão de menu mobile */}
          <button
            className="md:hidden flex items-center justify-center text-[var(--primary-color)] text-2xl bg-none border-none outline-none cursor-pointer"
            onClick={toggleMenu}
            aria-label="Abrir/Fechar Menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navegação Mobile */}
        <nav
          className={`
          md:hidden fixed top-[70px] left-0 w-full bg-[var(--secondary-color)] shadow-md transition-all duration-300 
          ${
            isMenuOpen
              ? ' py-6 px-4 flex flex-col'
              : 'max-h-0 overflow-hidden py-0 px-0'
          }
          rounded-b-2xl
        `}
          style={{ zIndex: 999 }}
        >
          <NavLinks
            mode="mobile"
            isServicesMobileOpen={isServicesMobileOpen}
            setIsServicesMobileOpen={setIsServicesMobileOpen}
            onSectionClick={(e, sectionId) => {
              // Para mobile, abre modal apenas se for service-medico
              if (sectionId === 'service-medico') {
                handleSectionClick(e, sectionId);
                setOpenModalVideoRM(true);
              } else {
                handleSectionClick(e, sectionId);
              }
            }}
            openModalVideoRM={() => setOpenModalVideoRM(true)}
          />
          <div className="flex flex-col gap-4 w-full pt-4 border-t border-[var(--border-color)] mt-4">
            <EntrarButton onClick={handleLoginRedirect} mode="mobile" />
          </div>
        </nav>
      </header>

      <ModalVideoRM
        isOpen={openModalVideoRM}
        onClose={() => setOpenModalVideoRM(false)}
      />
    </>
  );
};

export default HeaderLadingPage;
