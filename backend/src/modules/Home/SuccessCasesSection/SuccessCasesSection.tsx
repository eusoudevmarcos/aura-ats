// src/modules/Home/SuccessCasesSection/SuccessCasesSection.tsx
import React from 'react';
import Image from 'next/image';
import styles from './SuccessCasesSection.module.css';

const SuccessCasesSection: React.FC = () => {
  // Array com os paths das imagens dos logos
  // ATENÇÃO: Você precisará criar estas imagens na pasta public/images/
  const logos = [
    '/images/logo-client-1.png',
    '/images/logo-client-2.png',
    '/images/logo-client-3.png',
    '/images/logo-client-4.png',
    '/images/logo-client-5.png',
    '/images/logo-client-6.png',
    '/images/logo-client-7.png',
    '/images/logo-client-8.png',
    '/images/logo-client-9.png',
    '/images/logo-client-10.png',
    '/images/logo-client-11.png',
    '/images/logo-client-12.png',
  ];

  return (
    <section id="success-cases-section" className={styles.sectionContainer}>
      <h2>Nossos Cases de Sucesso: Empresas que Confiam na Take It</h2>
      <p className={styles.subtitle}>
        Veja algumas das empresas que já impulsionaram seus resultados com o recrutamento estratégico da Take It.
      </p>
      <div className={styles.logosGrid}>
        {logos.map((logo, index) => (
          <div key={index} className={styles.logoContainer}>
            <Image
              src={logo}
              alt={`Logo do Cliente ${index + 1}`}
              width={150} // Ajuste o tamanho conforme necessário
              height={50}
              objectFit="contain" // Garante que o logo caiba no espaço
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuccessCasesSection;