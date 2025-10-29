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
    imageSrc: '/landing-page/recrutamento-medico.png',
    altText: 'Médico sorrindo, representando a área da saúde',
    title: 'O Match Perfeito em Recrutamento Médico',
    description:
      'Encontre os melhores médicos em tempo recorde. Conexões ideais em até 7 dias.',
  },
  {
    id: 'slide2',
    imageSrc: '/landing-page/world.png',
    altText: 'Desenvolvedores trabalhando, representando a área de TI',
    title: 'Inovação em Recrutamento de TI',
    description:
      'Profissionais de tecnologia altamente qualificados para as suas demandas mais complexas.',
  },
  {
    id: 'slide3',
    imageSrc: '/landing-page/vagas-executivas-2.png',
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
      className="relative w-full min-h-[500px] mx-auto mt-10 max-w-[1620px]"
    >
      <Slider slides={heroSlides} autoPlay interval={10000}>
        {(slide: SlideItem, isExiting: boolean) => (
          <div
            className="relative flex flex-col md:flex-row items-center justify-between w-full max-w-[1200px] mx-auto px-4 py-2"
            key={slide.id}
          >
            <div
              className={`flex-1/2 flex flex-col justify-center items-start text-left max-w-2xl transition-all duration-[400ms] ease-in-out
                  ${
                    isExiting
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-100 translate-x-0 scale-100'
                  }
                `}
              style={
                !isExiting
                  ? { animation: 'slideInFromCenter 400ms ease-out' }
                  : undefined
              }
            >
              <h1 className="text-[2.25rem] md:text-6xl text-primary font-black text-shadow-2xs mb-4">
                {slide.title}
              </h1>
              <p className="text-[1.15rem] md:text-[1.25rem] mb-[var(--spacing-md)] text-secondary max-w-xl">
                {slide.description}
              </p>
              <Button
                onClick={handleContratarClick}
                variant="primary"
                size="large"
              >
                Saiba Mais
              </Button>
            </div>

            {/* Imagem destacada do slide, à direita */}
            <div
              className={`flex-1 flex justify-center items-center  mt-10 md:mt-0 md:ml-10 transition-all duration-[400ms] ease-in-out w-[320px]  md:w-[500px] h-[600px]
                  ${
                    isExiting
                      ? 'opacity-0 translate-x-full'
                      : 'opacity-100 translate-x-0 scale-100'
                  }
                `}
              style={
                !isExiting
                  ? {
                      animation: 'slideInFromCenter 400ms ease-out',
                    }
                  : undefined
              }
            >
              <Image
                src={slide.imageSrc}
                alt={slide.altText}
                width={400}
                height={400}
                className="object-contain w-full h-full max-w-[400px]"
                priority={true}
              />
            </div>
          </div>
        )}
      </Slider>

      <style>{`
        @keyframes slideInFromCenter {
          from {
            opacity: 0;
            transform: scale(0.4) translateZ(0);
          }
          to {
            opacity: 1;
            transform: scale(1) translateZ(0);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
