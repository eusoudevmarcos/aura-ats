// src/modules/Home/SuccessCasesSection/SuccessCasesSection.tsx
import Image from 'next/image';
import React from 'react';
import styles from './SuccessCasesSection.module.css';

const SuccessCasesSection: React.FC = () => {
  // Gera automaticamente as 34 imagens da pasta public/landing-page/empresas
  const companyImages = Array.from(
    { length: 34 },
    (_, index) => `/landing-page/empresas/${index + 1}.jpg`
  );

  return (
    <section id="success-cases-section" className={styles.sectionContainer}>
      <h2>Nossos Cases de Sucesso: Empresas que Confiam na Aura</h2>
      <p className={styles.subtitle}>
        Veja algumas das empresas que já impulsionaram seus resultados com o
        recrutamento estratégico da Aura.
      </p>
      <div className={styles.sliderViewport}>
        <div className={styles.sliderTrack}>
          {companyImages.concat(companyImages).map((src, index) => (
            <div key={index} className={styles.slideItem}>
              <Image
                src={src}
                alt={`Logo da Empresa ${(
                  (index % companyImages.length) +
                  1
                ).toString()}`}
                width={180}
                height={90}
                className={styles.logoImage}
                style={{ objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessCasesSection;
