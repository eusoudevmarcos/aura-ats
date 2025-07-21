// src/modules/Home/HeroSection/HeroSection.tsx
import React from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';
import Button from '@/components/Button/Button';
import Slider from '@/components/Slider/Slider';
import { useScrollToSection } from '@/hooks/UseScrollToSection';

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
    description: 'Encontre os melhores médicos em tempo recorde. Conexões ideais em até 7 dias.',
  },
  {
    id: 'slide2',
    imageSrc: '/images/hero-tech.jpg',
    altText: 'Desenvolvedores trabalhando, representando a área de TI',
    title: 'Inovação em Recrutamento de TI',
    description: 'Profissionais de tecnologia altamente qualificados para as suas demandas mais complexas.',
  },
  {
    id: 'slide3',
    imageSrc: '/images/hero-executive.png',
    altText: 'Profissional executivo em reunião, representando vagas executivas',
    title: 'Liderança e Visão para Vagas Executivas',
    description: 'Os talentos que sua empresa precisa para alcançar novos patamares de sucesso.',
  },
];

interface HeroSectionProps {
  // Se houver props específicas para a Hero Section
}

const HeroSection: React.FC<HeroSectionProps> = () => {
  const scrollToSection = useScrollToSection();

  const handleContratarClick = () => {
    scrollToSection('platform-section');
  };

  return (
    <section className={styles.hero} id="hero-section">
      <Slider slides={heroSlides} autoPlay interval={5000}>
        {(slide) => (
          <div key={slide.id} className={styles.slideContent}>
            <Image
              src={slide.imageSrc}
              alt={slide.altText}
              fill
              // ALTERADO: Removido o estilo inline objectFit e zIndex
              priority
            />
            <div className={styles.overlay}></div>
            <div className={styles.textContainer}>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <Button onClick={handleContratarClick} variant="primary" size="large">
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