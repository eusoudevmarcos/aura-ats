// src/modules/Home/ServicesSection/ServicesSection.tsx
import Link from 'next/link';
import React from 'react';
import { FaBriefcase, FaLaptopCode, FaUserMd } from 'react-icons/fa';

// Array de objetos dos serviços (com dados puros, sem HTML)
const serviceCards = [
  {
    icon: 'FaUserMd',
    link: 'pricing-section',
    iconComponent: FaUserMd,
    title: 'Recrutamento Médico',
    description:
      'Encontre médicos especialistas, clínicos gerais e profissionais da saúde com agilidade. Nossa plataforma exclusiva e o rigoroso processo seletivo garantem a contratação dos melhores talentos para hospitais, clínicas e consultórios.',
    bulletPoints: [
      'Avaliação de currículos e perfis',
      'Entrevistas comportamentais e técnicas',
      'Verificação de referências',
      'Plataforma de match inteligente',
    ],
    listClassName: '',
  },
  {
    icon: 'FaLaptopCode',
    iconComponent: FaLaptopCode,
    title: 'Recrutamento de TI',
    description:
      'Conecte-se com os profissionais de tecnologia mais inovadores do mercado. De desenvolvedores a especialistas em cibersegurança, unimos sua empresa aos talentos que impulsionarão sua transformação digital.',
    bulletPoints: [
      'Validação de habilidades técnicas',
      'Testes de lógica e programação',
      'Entrevistas com especialistas de TI',
      'Acesso a talentos de nicho',
    ],
    listClassName: 'ml-8',
  },
  {
    icon: 'FaBriefcase',
    iconComponent: FaBriefcase,
    title: 'Vagas Executivas',
    description:
      'Encontre líderes com visão e experiência para cargos de alta gestão. Nosso headhunting estratégico identifica e atrai executivos que farão a diferença no crescimento e na cultura da sua organização.',
    bulletPoints: [
      'Hunting ativo e sigiloso',
      'Avaliação de liderança e estratégia',
      'Assessment de perfil executivo',
      'Processo de integração (onboarding)',
    ],
    listClassName: '',
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section
      id="services-section"
      className="max-w-[1420px] mx-auto text-center text-primarypx-4"
    >
      <h2 className="font-black text-primary text-3xl md:text-4xl mb-2">
        Nossos Serviços: O Match Perfeito para Cada Necessidade
      </h2>
      <p className="text-lg text-gray-500 mb-12 max-w-[800px] mx-auto">
        A Aura é especialista em encontrar os talentos certos para as posições
        mais estratégicas da sua empresa. Conheça nossas áreas de atuação e
        descubra como podemos impulsionar seu time.
      </p>

      <div
        className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8
        "
      >
        {serviceCards.map((service, idx) => {
          const Icon = service.iconComponent;
          return (
            <Link
              href={`#${service.link}`}
              key={service.title}
              className="
                bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center border border-gray-200
                transition-transform duration-300 hover:-translate-y-1 hover:shadow-md
              "
            >
              <div className="text-5xl text-accent mb-6 text-primary">
                <Icon />
              </div>
              <h3 className="text-primary text-xl md:text-2xl font-semibold mb-2">
                {service.title}
              </h3>
              <p className="text-gray-500 text-base mb-4 flex-grow">
                {service.description}
              </p>
              <ul
                className={`list-none p-0 text-left w-full mt-2 mb-4 ${
                  service.listClassName || ''
                }`}
              >
                {service.bulletPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-center text-sm text-gray-500 mb-1"
                  >
                    <span className="text-primary font-bold mr-2">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
