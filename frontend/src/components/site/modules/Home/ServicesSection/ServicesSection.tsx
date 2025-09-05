// src/modules/Home/ServicesSection/ServicesSection.tsx
import React from 'react';
import { FaBriefcase, FaLaptopCode, FaUserMd } from 'react-icons/fa';

const ServicesSection: React.FC = () => {
  return (
    <section
      id="services-section"
      className="max-w-[1420px] mx-auto text-center text-primarypx-4"
    >
      <h2 className="font-black text-primary text-3xl md:text-4xl mb-6">
        Nossos Serviços: O Match Perfeito para Cada Necessidade
      </h2>
      <p className="text-lg text-gray-500 mb-12 max-w-[800px] mx-auto">
        A Aura é especialista em encontrar os talentos certos para as posições
        mais estratégicas da sua empresa. Conheça nossas áreas de atuação e
        descubra como podemos impulsionar seu time.
      </p>

      <div
        className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8
        "
      >
        {/* Card de Serviço: Recrutamento Médico */}
        <div
          className="
            bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center border border-gray-200
            transition-transform duration-300 hover:-translate-y-1 hover:shadow-md
          "
        >
          <div className="text-5xl text-accent mb-6 text-primary">
            <FaUserMd />
          </div>
          <h3 className="text-primary text-xl md:text-2xl font-semibold mb-2">
            Recrutamento Médico
          </h3>
          <p className="text-gray-500 text-base mb-4 flex-grow">
            Encontre médicos especialistas, clínicos gerais e profissionais da
            saúde com agilidade. Nossa plataforma exclusiva e o rigoroso
            processo seletivo garantem a contratação dos melhores talentos para
            hospitais, clínicas e consultórios.
          </p>
          <ul className="list-none p-0 text-left w-full mt-2 mb-4">
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Avaliação de currículos e perfis
            </li>
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Entrevistas comportamentais e técnicas
            </li>
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Verificação de referências
            </li>
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Plataforma de match inteligente
            </li>
          </ul>
        </div>

        {/* Card de Serviço: Recrutamento de TI */}
        <div
          className="
            bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center border border-gray-200 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="text-5xl text-accent mb-6  text-primary">
            <FaLaptopCode />
          </div>
          <h3 className="text-primary text-xl md:text-2xl font-semibold mb-2">
            Recrutamento de TI
          </h3>
          <p className="text-gray-500 text-base mb-4 flex-grow">
            Conecte-se com os profissionais de tecnologia mais inovadores do
            mercado. De desenvolvedores a especialistas em cibersegurança,
            unimos sua empresa aos talentos que impulsionarão sua transformação
            digital.
          </p>
          <ul className="list-none p-0 text-left w-full mt-2 mb-4">
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Validação de habilidades técnicas
            </li>
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Testes de lógica e programação
            </li>
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Entrevistas com especialistas de TI
            </li>
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Acesso a talentos de nicho
            </li>
          </ul>
        </div>

        {/* Card de Serviço: Vagas Executivas */}
        <div
          className="
            bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center border border-gray-200 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="text-5xl text-accent mb-6 text-primary">
            <FaBriefcase />
          </div>
          <h3 className="text-primary text-xl md:text-2xl font-semibold mb-2">
            Vagas Executivas
          </h3>
          <p className="text-gray-500 text-base mb-4 flex-grow">
            Encontre líderes com visão e experiência para cargos de alta gestão.
            Nosso headhunting estratégico identifica e atrai executivos que
            farão a diferença no crescimento e na cultura da sua organização.
          </p>
          <ul className="list-none p-0 text-left w-full mt-2 mb-4">
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Hunting ativo e sigiloso
            </li>
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Avaliação de liderança e estratégia
            </li>
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Assessment de perfil executivo
            </li>
            <li className="flex items-center text-sm text-gray-500 mb-1">
              <span className="text-primary font-bold mr-2">✓</span>
              Processo de integração (onboarding)
            </li>
          </ul>
        </div>
      </div>
      {/* Você pode adicionar um botão aqui se quiser um CTA genérico para serviços */}
      {/* <Button variant="primary" size="large" className="mt-8">
        Saiba Mais sobre Nossos Serviços
      </Button> */}
    </section>
  );
};

export default ServicesSection;
