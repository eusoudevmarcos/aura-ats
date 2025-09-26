import Button from '@/components/site/Button/Button';
import Slider from '@/components/site/Slider/Slider';
import { useScrollToSection } from '@/hook/UseScrollToSection';
import Image from 'next/image';
import React from 'react';

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
    <section
      id="hero-section"
      className="relative w-full h-[100vh] max-h-[800px] min-h-[500px] overflow-hidden mx-auto md:min-h-[900px] border-b-8 border-primary"
    >
      <Slider slides={heroSlides} autoPlay interval={10000}>
        {(slide: SlideItem) => (
          <div
            key={slide.id}
            className="relative w-full h-full flex items-center justify-center text-secondary"
          >
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.imageSrc}
                  alt={slide.altText}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover w-full h-full blur-[4px] brightness-[0.5]"
                  style={{
                    boxShadow:
                      '0 8px 32px 0 rgba(0,0,0,0.18), 0 2px 10px 0 rgba(0,0,0,0.50)',
                  }}
                />
              </div>
              <div
                className="
                  absolute top-0 left-0 w-full h-full
                  bg-gradient-to-t from-black/60 to-black/20
                  z-[1]
                "
              ></div>
            </div>
            <div
              className="
                relative z-[2] text-center max-w-[900px]
                px-[var(--spacing-md)] py-[var(--spacing-lg)]
              "
            >
              <h1 className="text-[2.75rem] text-white font-black text-shadow-2xs">
                {slide.title}
              </h1>
              <p
                className="
                  text-[1.25rem] mb-[var(--spacing-md)]
                  text-[var(--bg-color-light)]
                "
              >
                {slide.description}
              </p>
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
