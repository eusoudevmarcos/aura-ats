// src/modules/Home/SuccessCasesSection/SuccessCasesSection.tsx
import React from 'react';
import Image from 'next/image';
import styles from './SuccessCasesSection.module.css';

const SuccessCasesSection: React.FC = () => {
  // Array com os paths das imagens dos logos
  // ATENÇÃO: Você precisará criar estas imagens na pasta public/images/
  const logos = [
    '/images/99hunters-1.svg',
    '/images/CENTROMEB.webp',
    '/images/chamealulogo.png',
    '/images/diem.png',
    '/images/unimed.jpg',
    '/images/konia.png',
    '/images/coretech.png',
    '/images/hapvida.png',
    '/images/medco.svg',
    '/images/rededor.webp',
    '/images/TIVOLI.webp',
    '/images/V4LOGO.webp',
  ];

  return (
    <section id="success-cases-section" className={styles.sectionContainer}>
      <h2>Nossos Cases de Sucesso: Empresas que Confiam na Aura</h2>
      <p className={styles.subtitle}>
        Veja algumas das empresas que já impulsionaram seus resultados com o recrutamento estratégico da Aura.
      </p>
      <div className={styles.logosGrid}>
        {logos.map((logo, index) => (
          <div key={index} className={styles.logoContainer}>
          <Image
            src={logo}
            alt={`Logo do Cliente ${index + 1}`}
            width={150}
            height={50}
            style={{ objectFit: 'contain' }}
            className={styles.logoImage}
          />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuccessCasesSection;
