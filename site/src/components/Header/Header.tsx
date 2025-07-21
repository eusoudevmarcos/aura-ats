// src/components/Header/Header.tsx
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import Button from "@/components/Button/Button";
import { FaBars, FaTimes, FaWhatsapp } from "react-icons/fa"; // Importe FaWhatsapp

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const whatsappNumber = "5561992483665"; // Seu número WhatsApp
  const whatsappMessage = encodeURIComponent(
    "Olá, Take It! Gostaria de mais informações sobre seus serviços."
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const LINK_LOGIN = process.env.LINK_LOGIN;

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

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" onClick={(e) => scrollToSection(e, "hero-section")}>
            <Image
              src="../../images/auralogoh.svg"
              alt="Aura Logo"
              width={80}
              height={20}
              priority
            />
          </Link>
        </div>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
          <ul className={styles.navList}>
            <li>
              <Link
                href="#platform-section"
                onClick={(e) =>
                  scrollToSection(
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
                  scrollToSection(
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
                  scrollToSection(
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
                  scrollToSection(
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
                  scrollToSection(
                    e as React.MouseEvent<HTMLAnchorElement>,
                    "success-cases-section"
                  )
                }
              >
                Cases
              </Link>
            </li>{" "}
            {/* Adicionado link para Cases */}
            <li>
              <Link
                href="#contact-section"
                onClick={(e) =>
                  scrollToSection(
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
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButtonMobile}
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <Button
              variant="primary"
              size="medium"
              href={LINK_LOGIN + "/login"}
              onClick={(e) =>
                scrollToSection(
                  e as React.MouseEvent<HTMLButtonElement>,
                  "contact-section"
                )
              }
            >
              Entrar
            </Button>
          </div>
        </nav>

        <div className={styles.headerActions}>
          {/* Novo botão de WhatsApp no desktop */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.whatsappButtonDesktop} ${
              isScrolled ? styles.scrolledWhatsapp : ""
            }`}
          >
            <FaWhatsapp /> WhatsApp
          </a>
          <Button
            variant="outlined"
            size="medium"
            onClick={(e) =>
              scrollToSection(
                e as React.MouseEvent<HTMLButtonElement>,
                "contact-section"
              )
            }
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
