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
      <section className="mb-8" id="hero-section">
        <HeroSection />
      </section>

      <section className="mb-8" id="platform-section">
        <PlatformSection />
      </section>

      <section className="mb-8" id="about-section">
        <AboutSection />
      </section>

      <section className="mb-8" id="services-section">
        <ServicesSection />
      </section>

      <section className="mb-8" id="pricing-section">
        <PricingSection />
      </section>

      <section className="mb-8" id="success-cases-section">
        <SuccessCasesSection />
      </section>

      <section className="mb-8" id="contact-section">
        <ContactSection />
      </section>

      <ScrollToTop />
    </>
  );
};

export default HomePage;
