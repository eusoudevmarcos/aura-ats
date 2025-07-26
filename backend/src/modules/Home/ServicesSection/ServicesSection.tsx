// src/modules/Home/ServicesSection/ServicesSection.tsx
import React from 'react';
import Image from 'next/image';
import { FaUserMd, FaLaptopCode, FaBriefcase } from 'react-icons/fa'; // Ícones para os serviços
import styles from './ServicesSection.module.css';

const ServicesSection: React.FC = () => {
  return (
    <section id="services-section" className={styles.sectionContainer}>
      <h2>Nossos Serviços: O Match Perfeito para Cada Necessidade</h2>
      <p className={styles.subtitle}>
        A Take It é especialista em encontrar os talentos certos para as posições mais estratégicas da sua empresa.
        Conheça nossas áreas de atuação e descubra como podemos impulsionar seu time.
      </p>

      <div className={styles.servicesGrid}>
        {/* Card de Serviço: Recrutamento Médico */}
        <div className={styles.serviceCard}>
          <div className={styles.iconWrapper}>
            <FaUserMd />
          </div>
          <h3>Recrutamento Médico</h3>
          <p>
            Encontre médicos especialistas, clínicos gerais e profissionais da saúde com agilidade. Nossa plataforma exclusiva e o rigoroso processo seletivo garantem a contratação dos melhores talentos para hospitais, clínicas e consultórios.
          </p>
          <ul>
            <li>Avaliação de currículos e perfis</li>
            <li>Entrevistas comportamentais e técnicas</li>
            <li>Verificação de referências</li>
            <li>Plataforma de match inteligente</li>
          </ul>
        </div>

        {/* Card de Serviço: Recrutamento de TI */}
        <div className={styles.serviceCard}>
          <div className={styles.iconWrapper}>
            <FaLaptopCode />
          </div>
          <h3>Recrutamento de TI</h3>
          <p>
            Conecte-se com os profissionais de tecnologia mais inovadores do mercado. De desenvolvedores a especialistas em cibersegurança, unimos sua empresa aos talentos que impulsionarão sua transformação digital.
          </p>
          <ul>
            <li>Validação de habilidades técnicas</li>
            <li>Testes de lógica e programação</li>
            <li>Entrevistas com especialistas de TI</li>
            <li>Acesso a talentos de nicho</li>
          </ul>
        </div>

        {/* Card de Serviço: Vagas Executivas */}
        <div className={styles.serviceCard}>
          <div className={styles.iconWrapper}>
            <FaBriefcase />
          </div>
          <h3>Vagas Executivas</h3>
          <p>
            Encontre líderes com visão e experiência para cargos de alta gestão. Nosso headhunting estratégico identifica e atrai executivos que farão a diferença no crescimento e na cultura da sua organização.
          </p>
          <ul>
            <li>Hunting ativo e sigiloso</li>
            <li>Avaliação de liderança e estratégia</li>
            <li>Assessment de perfil executivo</li>
            <li>Processo de integração (onboarding)</li>
          </ul>
        </div>
      </div>
      {/* Você pode adicionar um botão aqui se quiser um CTA genérico para serviços */}
      {/* <Button variant="primary" size="large" className={styles.ctaButton}>
        Saiba Mais sobre Nossos Serviços
      </Button> */}
    </section>
  );
};

export default ServicesSection;