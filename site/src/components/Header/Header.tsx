// src/components/Header/Header.tsx
import Button from "@/components/Button/Button";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollToSection } = useSmoothScroll();

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
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
    if (process.env.NODE_ENV === "production") {
      window.location.href = "https://aura-ats-frontend.vercel.app/login";
    } else {
      window.location.href = "http://localhost:3000/login";
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link
            href="/"
            onClick={(e) =>
              handleSectionClick(
                e as React.MouseEvent<HTMLAnchorElement>,
                "hero-section"
              )
            }
          >
            <Image
              src="/images/auralogoh.svg"
              alt="Logo"
              width={150}
              height={50}
              style={{ objectFit: "contain" }}
            />
          </Link>
        </div>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
          <ul className={styles.navList}>
            <li>
              <Link
                href="#platform-section"
                onClick={(e) =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    "platform-section"
                  )
                }
              >
                A Plataforma
              </Link>
            </li>
            <li>
              <Link
                href="#about-section"
                onClick={(e) =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    "about-section"
                  )
                }
              >
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link
                href="#services-section"
                onClick={(e) =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    "services-section"
                  )
                }
              >
                Serviços
              </Link>
            </li>
            <li>
              <Link
                href="#pricing-section"
                onClick={(e) =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    "pricing-section"
                  )
                }
              >
                Preços
              </Link>
            </li>
            <li>
              <Link
                href="#success-cases-section"
                onClick={(e) =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    "success-cases-section"
                  )
                }
              >
                Cases
              </Link>
            </li>
            <li>
              <Link
                href="#contact-section"
                onClick={(e) =>
                  handleSectionClick(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    "contact-section"
                  )
                }
              >
                Contato
              </Link>
            </li>
          </ul>
          <div className={styles.navActionsMobile}>
            <Button
              variant="primary"
              size="medium"
              onClick={handleLoginRedirect}
            >
              Entrar
            </Button>
          </div>
        </nav>

        <div className={styles.headerActions}>
          <Button
            variant="outlined"
            size="medium"
            onClick={handleLoginRedirect}
            className={`${styles.enterButton} ${
              isScrolled ? styles.scrolledEnter : ""
            }`}
          >
            Entrar
          </Button>
        </div>

        <button
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label="Abrir/Fechar Menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Header;
