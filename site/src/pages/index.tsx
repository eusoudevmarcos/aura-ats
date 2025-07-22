// src/pages/index.tsx
import React from 'react';
import Head from 'next/head'; // Para meta tags e título da página

// Importe os componentes de layout e seções
import MainLayout from '@/layouts/MainLayout';
import HeroSection from '@/modules/Home/HeroSection/HeroSection';
import PlatformSection from '@/modules/Home/PlatformSection/PlatformSection';
import AboutSection from '@/modules/Home/AboutSection/AboutSection';
import ServicesSection from '@/modules/Home/ServicesSection/ServicesSection';
import PricingSection from '@/modules/Home/PricingSection/PricingSection';
import SuccessCasesSection from '@/modules/Home/SuccessCasesSection/SuccessCasesSection'; 
import ContactSection from '@/modules/Home/ContactSection/ContactSection';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <Head>
        <title>Aura - Recrutamento Especializado para Saúde, TI e Executivos</title>
        <meta name="description" content="Aura: O match perfeito para sua empresa. Especialistas em recrutamento médico, TI e vagas executivas com agilidade e efetividade." />
      </Head>

      {/* As seções da sua Single Page Application, cada uma com um ID único */}
      <section id="hero-section">
        <HeroSection />
      </section>

      <section id="platform-section">
        <PlatformSection />
      </section>

      <section id="about-section">
        <AboutSection />
      </section>

      <section id="services-section">
        <ServicesSection />
      </section>

      <section id="pricing-section">
        <PricingSection />
      </section>

      <section id="success-cases-section"> {/* <-- RENDERIZE AQUI ABAIXO DE PRICING */}
        <SuccessCasesSection />
      </section>

      <section id="contact-section">
        <ContactSection />
      </section>

      {/* Futuramente, se houver outras seções, adicione-as aqui */}
    </MainLayout>
  );
};

export default HomePage;
