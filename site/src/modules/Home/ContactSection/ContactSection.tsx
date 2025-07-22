// src/modules/Home/ContactSection/ContactSection.tsx
import React from 'react';
import styles from './ContactSection.module.css';
import Button from '@/components/Button/Button';

const ContactSection: React.FC = () => {
  // Número de telefone para o WhatsApp (inclua o código do país, ex: 55 para Brasil)
  const whatsappNumber = '5561992483665'; // Exemplo: +55 11 98765-4321
  const whatsappMessage = encodeURIComponent('Olá, Aura! Gostaria de mais informações sobre seus serviços.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section id="contact-section" className={styles.sectionContainer}>
      <h2>Vamos Conectar!</h2>
      <p className={styles.subtitle}>
        Entre em contato conosco e descubra como podemos ajudar a sua empresa a encontrar os talentos certos.
      </p>

      <div className={styles.contactActions}>
        {/* Botão principal de contato */}
        <Button
          variant="primary"
          size="large"
          onClick={() => window.open(whatsappLink, '_blank')} // Abre em nova aba
          className={styles.contactButton}
        >
          Entre em Contato via WhatsApp
        </Button>
        
      </div>
    </section>
  );
};

export default ContactSection;