import Button from '@/components/site/Button/Button';
import Slider from '@/components/site/Slider/Slider';
import { useScrollToSection } from '@/hook/UseScrollToSection';
import Image from 'next/image';
import React from 'react';
import styles from './HeroSection.module.css';

interface SlideItem {
  id: string;
  imageSrc: string;
  altText: string;
  title: string;
  description: string;
}

const heroSlides: SlideItem[] = [
  {
    id: 'slide1',
    imageSrc: '/images/hero-doctor.jpg',
    altText: 'Médico sorrindo, representando a área da saúde',
    title: 'O Match Perfeito em Recrutamento Médico',
    description:
      'Encontre os melhores médicos em tempo recorde. Conexões ideais em até 7 dias.',
  },
  {
    id: 'slide2',
    imageSrc: '/images/hero-tech.jpg',
    altText: 'Desenvolvedores trabalhando, representando a área de TI',
    title: 'Inovação em Recrutamento de TI',
    description:
      'Profissionais de tecnologia altamente qualificados para as suas demandas mais complexas.',
  },
  {
    id: 'slide3',
    imageSrc: '/images/hero-executive.png',
    altText:
      'Profissional executivo em reunião, representando vagas executivas',
    title: 'Liderança e Visão para Vagas Executivas',
    description:
      'Os talentos que sua empresa precisa para alcançar novos patamares de sucesso.',
  },
];

const HeroSection: React.FC = () => {
  const scrollToSection = useScrollToSection();

  const handleContratarClick = () => {
    scrollToSection('platform-section');
  };

  return (
    <section className={styles.hero} id="hero-section">
      <Slider slides={heroSlides} autoPlay interval={10000}>
        {(slide: SlideItem) => (
          <div className={styles.slideContent} key={slide.id}>
            <div className={styles.imageWrapper}>
              <Image
                src={slide.imageSrc}
                alt={slide.altText}
                fill
                priority
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  filter: 'blur(4px)',
                  boxShadow:
                    '0 8px 32px 0 rgba(0,0,0,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.10)',
                }}
              />
              <div className={styles.overlay}></div>
            </div>
            <div className={styles.textContainer}>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <Button
                onClick={handleContratarClick}
                variant="primary"
                size="large"
              >
                Quero Contratar a Plataforma
              </Button>
            </div>
          </div>
        )}
      </Slider>
    </section>
  );
};

export default HeroSection;
