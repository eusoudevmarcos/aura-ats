// src/components/Footer/Footer.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa'; // Ícones para redes sociais
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const whatsappLink = `https://wa.me/5561992483665?text=${encodeURIComponent('Olá, Aura! Gostaria de mais informações sobre seus serviços.')}`;

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.footerSection}>
          <Link href="/" className={styles.logoLink} aria-label="Voltar para o início">
            {/* Use a versão do logo que se encaixe melhor no footer, talvez uma branca ou monocromática */}
            <Image
              src="/images/auralogoh.svg" // Exemplo: se você tiver uma versão branca/clara do logo
              alt="Aura logo"
              width={100}
              height={50}
              priority
            />
          </Link>
          <p className={styles.description}>
            Conectando talentos às empresas que transformam o futuro da saúde e tecnologia.
          </p>
          <div className={styles.socialIcons}>
            <a href="https://www.linkedin.com/company/aurareslabs/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn da Aura">
              <FaLinkedin />
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da Aura">
              <FaWhatsapp />
            </a>
            <a href="mailto:comercial@aurareslabs.com" aria-label="Enviar e-mail para Aura">
              <FaEnvelope />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Navegação Rápida</h3>
          <ul className={styles.linksList}>
            <li><Link href="#platform-section">A Plataforma</Link></li>
            <li><Link href="#about-section">Sobre Nós</Link></li>
            <li><Link href="#services-section">Serviços</Link></li>
            <li><Link href="#pricing-section">Preços</Link></li>
            <li><Link href="#success-cases-section">Cases de Sucesso</Link></li>
            <li><Link href="#contact-section">Contato</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Contato</h3>
          <p>📍 Brasília, Vicente Pires,
          ch 25/4 - Distrito Federal</p>
          <p>📞 +55 61 99248-3665</p>
          <p>📧 comercial@aurareslabs.com</p>
        </div>
      </div>

      <div className={styles.copyRight}>
        <p>&copy; {currentYear} Aura R&S Labs. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
