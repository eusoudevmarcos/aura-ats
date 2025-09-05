// src/components/Header/Header.tsx
import Button from '@/components/site/Button/Button';
import { useSmoothScroll } from '@/hook/useSmoothScroll';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const HeaderLadingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const { scrollToSection } = useSmoothScroll();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Lógica para mostrar/esconder header SOMENTE no mobile
  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;
      const currentScrollY = window.scrollY;

      // Sombra/cor para desktop e mobile
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

      // Se parou de rolar (sem movimento), mostra o header mobile imediatamente
      // if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      // scrollTimeout.current = setTimeout(() => {
      //   setShowMobileHeader(true);
      // }, 1000);

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
  };

  const handleLoginRedirect = () => {
    setIsMenuOpen(false);
    // Redireciona para a URL correta dependendo do ambiente
    if (process.env.NODE_ENV === 'production') {
      window.location.href = 'https://aura-ats-frontend.vercel.app/login';
    } else {
      window.location.href = 'http://localhost:3000/login';
    }
  };

  return (
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
        ${
          // Só aplica a animação de esconder no mobile
          typeof window !== 'undefined' && window.innerWidth < 768
            ? showMobileHeader
              ? 'translate-y-0'
              : '-translate-y-full'
            : 'translate-y-0'
        }
      `}
      style={{
        // Garante que a animação funcione no mobile
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
              style={{ objectFit: 'contain' }}
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
          <ul className="flex gap-8 list-none m-0 p-0">
            <li>
              <Link
                href="#platform-section"
                className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 block hover:text-[var(--primary-color)] transition-colors"
                onClick={e =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    'platform-section'
                  )
                }
              >
                A Plataforma
              </Link>
            </li>
            <li>
              <Link
                href="#about-section"
                className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 block hover:text-[var(--primary-color)] transition-colors"
                onClick={e =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    'about-section'
                  )
                }
              >
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link
                href="#services-section"
                className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 block hover:text-[var(--primary-color)] transition-colors"
                onClick={e =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    'services-section'
                  )
                }
              >
                Serviços
              </Link>
            </li>
            <li>
              <Link
                href="#pricing-section"
                className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 block hover:text-[var(--primary-color)] transition-colors"
                onClick={e =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    'pricing-section'
                  )
                }
              >
                Preços
              </Link>
            </li>
            <li>
              <Link
                href="#success-cases-section"
                className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 block hover:text-[var(--primary-color)] transition-colors"
                onClick={e =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    'success-cases-section'
                  )
                }
              >
                Cases
              </Link>
            </li>
            <li>
              <Link
                href="#contact-section"
                className="text-[var(--text-color-primary)] font-semibold text-base relative py-2 block hover:text-[var(--primary-color)] transition-colors"
                onClick={e =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    'contact-section'
                  )
                }
              >
                Contato
              </Link>
            </li>
          </ul>
        </nav>

        {/* Botão Entrar Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outlined"
            size="medium"
            onClick={handleLoginRedirect}
            className={`
              bg-transparent border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-semibold rounded px-3 py-1.5
              hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors
              ${isScrolled ? '' : ''}
            `}
          >
            Entrar
          </Button>
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
        <ul className="flex flex-col gap-3 text-right px-8">
          <li>
            <Link
              href="#platform-section"
              className="text-[var(--text-color-primary)] font-semibold text-lg py-2 block hover:text-[var(--primary-color)] transition-colors"
              onClick={e =>
                handleSectionClick(
                  e as React.MouseEvent<HTMLAnchorElement>,
                  'platform-section'
                )
              }
            >
              A Plataforma
            </Link>
          </li>
          <li>
            <Link
              href="#about-section"
              className="text-[var(--text-color-primary)] font-semibold text-lg py-2 block hover:text-[var(--primary-color)] transition-colors"
              onClick={e =>
                handleSectionClick(
                  e as React.MouseEvent<HTMLAnchorElement>,
                  'about-section'
                )
              }
            >
              Sobre Nós
            </Link>
          </li>
          <li>
            <Link
              href="#services-section"
              className="text-[var(--text-color-primary)] font-semibold text-lg py-2 block hover:text-[var(--primary-color)] transition-colors"
              onClick={e =>
                handleSectionClick(
                  e as React.MouseEvent<HTMLAnchorElement>,
                  'services-section'
                )
              }
            >
              Serviços
            </Link>
          </li>
          <li>
            <Link
              href="#pricing-section"
              className="text-[var(--text-color-primary)] font-semibold text-lg py-2 block hover:text-[var(--primary-color)] transition-colors"
              onClick={e =>
                handleSectionClick(
                  e as React.MouseEvent<HTMLAnchorElement>,
                  'pricing-section'
                )
              }
            >
              Preços
            </Link>
          </li>
          <li>
            <Link
              href="#success-cases-section"
              className="text-[var(--text-color-primary)] font-semibold text-lg py-2 block hover:text-[var(--primary-color)] transition-colors"
              onClick={e =>
                handleSectionClick(
                  e as React.MouseEvent<HTMLAnchorElement>,
                  'success-cases-section'
                )
              }
            >
              Cases
            </Link>
          </li>
          <li>
            <Link
              href="#contact-section"
              className="text-[var(--text-color-primary)] font-semibold text-lg py-2 block hover:text-[var(--primary-color)] transition-colors"
              onClick={e =>
                handleSectionClick(
                  e as React.MouseEvent<HTMLAnchorElement>,
                  'contact-section'
                )
              }
            >
              Contato
            </Link>
          </li>
        </ul>
        <div className="flex flex-col gap-4 w-full pt-4 border-t border-[var(--border-color)] mt-4">
          <Button
            variant="primary"
            size="medium"
            onClick={handleLoginRedirect}
            className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-[var(--whatsapp-green)] rounded-md bg-[var(--whatsapp-green)] text-[var(--secondary-color)] font-semibold text-base"
          >
            Entrar
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default HeaderLadingPage;
