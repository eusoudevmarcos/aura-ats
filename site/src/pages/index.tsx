// src/pages/index.tsx
import Head from "next/head"; // Para meta tags e título da página
import React from "react";

// Importe os componentes de layout e seções
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import MainLayout from "@/layouts/MainLayout";
import AboutSection from "@/modules/Home/AboutSection/AboutSection";
import ContactSection from "@/modules/Home/ContactSection/ContactSection";
import HeroSection from "@/modules/Home/HeroSection/HeroSection";
import PlatformSection from "@/modules/Home/PlatformSection/PlatformSection";
import PricingSection from "@/modules/Home/PricingSection/PricingSection";
import ServicesSection from "@/modules/Home/ServicesSection/ServicesSection";
import SuccessCasesSection from "@/modules/Home/SuccessCasesSection/SuccessCasesSection";

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <Head>
        <title>
          Aura - Recrutamento Especializado para Saúde, TI e Executivos
        </title>
        <meta
          name="description"
          content="Aura: O match perfeito para sua empresa. Especialistas em recrutamento médico, TI e vagas executivas com agilidade e efetividade."
        />
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

      <section id="success-cases-section">
        {" "}
        {/* <-- RENDERIZE AQUI ABAIXO DE PRICING */}
        <SuccessCasesSection />
      </section>

      <section id="contact-section">
        <ContactSection />
      </section>

      {/* Botão para voltar ao topo */}
      <ScrollToTop />

      {/* Futuramente, se houver outras seções, adicione-as aqui */}
    </MainLayout>
  );
};

export default HomePage;
