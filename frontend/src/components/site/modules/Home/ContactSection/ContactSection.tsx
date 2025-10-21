// src/modules/Home/ContactSection/ContactSection.tsx
import Button from '@/components/site/Button/Button';
import React from 'react';

const ContactSection: React.FC = () => {
  // Número de telefone para o WhatsApp (inclua o código do país, ex: 55 para Brasil)
  const whatsappNumber = '5561992483665'; // Exemplo: +55 11 98765-4321
  const whatsappMessage = encodeURIComponent(
    'Olá, Aura! Gostaria de mais informações sobre seus serviços.'
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section
      id="contact-section"
      className="
        max-w-[1420px] mx-auto text-center 
        text-[var(--text-color-primary)]
      "
    >
      <h2 className="text-primary text-3xl md:text-4xl font-bold mb-6">
        Vamos Conectar!
      </h2>
      <p
        className="
          text-lg md:text-base
          text-[var(--text-color-secondary)]
          mb-16 max-w-[800px] mx-auto
        "
      >
        Entre em contato conosco e descubra como podemos ajudar a sua empresa a
        encontrar os talentos certos.
      </p>

      <div
        className="
          flex flex-col items-center gap-8 mt-10
        "
      >
        {/* Botão principal de contato */}
        <Button
          variant="primary"
          size="large"
          onClick={() => window.open(whatsappLink, '_blank')} // Abre em nova aba
          className="min-w-[280px]"
        >
          Entre em Contato via WhatsApp
        </Button>
      </div>
    </section>
  );
};

export default ContactSection;
