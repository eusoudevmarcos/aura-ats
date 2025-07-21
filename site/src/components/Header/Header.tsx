// src/components/Header/Header.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Header.module.css';
import Button from '@/components/Button/Button';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const whatsappNumber = '5561992483665';
  const whatsappMessage = encodeURIComponent('Olá, Aura! Gostaria de mais informações sobre seus serviços.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  const handleLoginRedirect = () => {
    setIsMenuOpen(false);
    // ALTERADO: Redireciona para a URL completa da página de login no projeto 'frontend' (porta 3001)
    window.location.href = 'http://localhost:3001/login';
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" onClick={(e) => scrollToSection(e as React.MouseEvent<HTMLAnchorElement>, 'hero-section')}>
            <Image
              src="/images/auralogoh.svg"
              alt="Logo"
              width={150}
              height={50}
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            <li><Link href="#platform-section" onClick={(e) => scrollToSection(e as React.MouseEvent<HTMLAnchorElement>, 'platform-section')}>A Plataforma</Link></li>
            <li><Link href="#about-section" onClick={(e) => scrollToSection(e as React.MouseEvent<HTMLAnchorElement>, 'about-section')}>Sobre Nós</Link></li>
            <li><Link href="#services-section" onClick={(e) => scrollToSection(e as React.MouseEvent<HTMLAnchorElement>, 'services-section')}>Serviços</Link></li>
            <li><Link href="#pricing-section" onClick={(e) => scrollToSection(e as React.MouseEvent<HTMLAnchorElement>, 'pricing-section')}>Preços</Link></li>
            <li><Link href="#success-cases-section" onClick={(e) => scrollToSection(e as React.MouseEvent<HTMLAnchorElement>, 'success-cases-section')}>Cases</Link></li>
            <li><Link href="#contact-section" onClick={(e) => scrollToSection(e as React.MouseEvent<HTMLAnchorElement>, 'contact-section')}>Contato</Link></li>
          </ul>
          <div className={styles.navActionsMobile}>
            <Button variant="primary" size="medium" onClick={handleLoginRedirect}>Entrar</Button>
          </div>
        </nav>

        <div className={styles.headerActions}>
          <Button
            variant="outlined"
            size="medium"
            onClick={handleLoginRedirect} // ALTERADO: Redireciona para a página de login
            className={`${styles.enterButton} ${isScrolled ? styles.scrolledEnter : ''}`}
          >
            Entrar
          </Button>
        </div>

        <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Abrir/Fechar Menu">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Header;