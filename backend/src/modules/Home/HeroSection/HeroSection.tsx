// src/modules/Home/HeroSection/HeroSection.tsx
import React from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';
import Button from '@/components/Button/Button'; // Importa o componente Button que criaremos
import Slider from '@/components/Slider/Slider'; // Importa o componente Slider que criaremos
import { useScrollToSection } from '@/hooks/UseScrollToSection'; // Para rolagem suave

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
    imageSrc: '/images/hero-doctor.jpg', // <-- O caminho já aponta para public/images/
    altText: 'Médico sorrindo, representando a área da saúde',
    title: 'O Match Perfeito em Recrutamento Médico',
    description: 'Encontre os melhores médicos em tempo recorde. Conexões ideais em até 7 dias.',
  },
  {
    id: 'slide2',
    imageSrc: '/images/hero-tech.jpg', // <-- E aqui
    altText: 'Desenvolvedores trabalhando, representando a área de TI',
    title: 'Inovação em Recrutamento de TI',
    description: 'Profissionais de tecnologia altamente qualificados para as suas demandas mais complexas.',
  },
  {
    id: 'slide3',
    imageSrc: '/images/hero-executive.png', // <-- E aqui
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
    // Este botão deve abrir o modal com o vídeo demonstrativo da plataforma de médicos
    // Por enquanto, podemos simular a rolagem para a seção da plataforma
    scrollToSection('platform-section');
    // Futuramente: dispatch(openVideoModal());
  };

  return (
    <section className={styles.hero} id="hero-section">
      <Slider slides={heroSlides} autoPlay interval={5000}>
        {(slide) => (
          <div key={slide.id} className={styles.slideContent}>
            <Image
              src={slide.imageSrc}
              alt={slide.altText}
              fill // Permite que a imagem preencha o container
              style={{ objectFit: 'cover', zIndex: -1 }} // Estilo para a imagem de fundo
              priority // Carrega a imagem mais rápido pois está na primeira dobra
            />
            <div className={styles.overlay}></div> {/* Camada escura sobre a imagem */}
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