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
      className="relative w-full h-[100vh] max-h-[800px] min-h-[500px] overflow-hidden mx-auto md:min-h-[900px]"
    >
      <Slider slides={heroSlides} autoPlay interval={10000}>
        {(slide: SlideItem, isExiting: boolean) => (
          <div
            key={slide.id}
            className="relative w-full h-full flex items-center justify-center text-secondary"
          >
            <div
              className="
                relative z-[2] flex flex-col md:flex-row items-center justify-between w-full h-full
                max-w-[1200px] mx-auto px-[var(--spacing-md)] py-[var(--spacing-lg)]
              "
              style={{ minHeight: '500px' }}
            >
              {/* Conteúdo do texto + botão, à esquerda */}
              <div
                className={`
                  flex-1 flex flex-col justify-center items-start text-left max-w-xl
                  transition-all duration-[400ms] ease-in-out
                  ${
                    isExiting
                      ? 'opacity-0 -translate-x-full'
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
                <h1 className="text-[2.25rem] md:text-[2.75rem] text-primary font-black text-shadow-2xs mb-4 leading-relaxed">
                  {slide.title}
                </h1>
                <p
                  className="
                    text-[1.15rem] md:text-[1.25rem] mb-[var(--spacing-md)]
                    text-secondary
                  "
                >
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
                className={`
                  flex-1 flex justify-center items-center w-full h-full mt-10 md:mt-0 md:ml-10
                  transition-all duration-[400ms] ease-in-out
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
                <div className="relative w-[320px] md:w-[500px] h-full md:h-[600px] rounded-xl overflow-hidden shadowz-[3]">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.altText}
                    fill
                    sizes="(min-width: 768px) 400px, 320px"
                    className="object-contain w-full h-full"
                    priority={true}
                  />
                </div>
              </div>
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
