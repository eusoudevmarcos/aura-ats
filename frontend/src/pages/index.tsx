// src/pages/index.tsx
import React from 'react';

// Importe os componentes de layout e seções
import AboutSection from '@/components/site/modules/Home/AboutSection/AboutSection';
import ContactSection from '@/components/site/modules/Home/ContactSection/ContactSection';
import HeroSection from '@/components/site/modules/Home/HeroSection/HeroSection';
import PlatformSection from '@/components/site/modules/Home/PlatformSection/PlatformSection';
import PricingSection from '@/components/site/modules/Home/PricingSection/PricingSection';
import ServicesSection from '@/components/site/modules/Home/ServicesSection/ServicesSection';
import SuccessCasesSection from '@/components/site/modules/Home/SuccessCasesSection/SuccessCasesSection';
import ScrollToTop from '@/components/site/ScrollToTop/ScrollToTop';

const HomePage: React.FC = () => {
  return (
    <>
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
        <SuccessCasesSection />
      </section>

      <section id="contact-section">
        <ContactSection />
      </section>

      <ScrollToTop />
    </>
  );
};

export default HomePage;
