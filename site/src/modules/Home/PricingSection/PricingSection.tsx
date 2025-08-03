// src/modules/Home/PricingSection/PricingSection.tsx
import React from "react";
import styles from "./PricingSection.module.css";
import Button from "@/components/Button/Button";
import { FaCheckCircle } from "react-icons/fa"; // Ícone de check

const PricingSection: React.FC = () => {
  const handleContactClick = (planName: string) => {
    // Aqui você pode rolar para a seção de contato ou disparar um modal de formulário
    document
      .getElementById("contact-section")
      ?.scrollIntoView({ behavior: "smooth" });
    alert(
      `Obrigado pelo seu interesse no plano ${planName}! Por favor, preencha o formulário de contato abaixo para que possamos discutir suas necessidades.`
    );
  };

  return (
    <section id="pricing-section" className={styles.sectionContainer}>
      <h2>
        Planos de Contratação: Encontre o Talento Ideal para Seu Orçamento
      </h2>
      <p className={styles.subtitle}>
        A Take It oferece soluções flexíveis de recrutamento e seleção para
        atender às necessidades específicas da sua empresa, seja qual for o
        tamanho da sua demanda.
      </p>

      <div className={styles.pricingGrid}>
        {/* Plano Básico */}
        <div className={styles.pricingCard}>
          <h3>Plano Essencial</h3>
          <p className={styles.tagline}>Ideal para primeiras contratações</p>
          <p className={styles.price}>
            60%/Salário<span>/vaga</span>
          </p>
          <ul className={styles.featuresList}>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Publicação de vaga
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Triagem inicial de
              currículos
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Entrevistas com 3
              candidatos finalistas
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Suporte via e-mail
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Garantia de 30 dias
            </li>
          </ul>
          <Button
            variant="accent"
            size="large"
            fullWidth
            onClick={() => handleContactClick("Essencial")}
          >
            Solicitar Contato
          </Button>
        </div>

        {/* Plano Padrão */}
        <div className={styles.pricingCard}>
          <h3>Plano Profissional</h3>
          <p className={styles.tagline}>Para volume moderado de contratações</p>
          <p className={styles.price}>
            80%/Salário<span>/vaga</span>
          </p>
          <ul className={styles.featuresList}>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Tudo do Plano
              Essencial
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Avaliação de perfil
              comportamental
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Entrevistas com 5
              candidatos finalistas
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Headhunting
              estratégico
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Suporte prioritário
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Garantia de 60 dias
            </li>
          </ul>
          <Button
            variant="primary" // Destaque para este plano
            size="large"
            fullWidth
            onClick={() => handleContactClick("Profissional")}
          >
            Solicitar Contato
          </Button>
        </div>

        {/* Plano Premium */}
        <div className={styles.pricingCard}>
          <h3>Plano Premium</h3>
          <p className={styles.tagline}>
            Solução completa para grandes demandas
          </p>
          <p className={styles.price}>A Consultar</p>{" "}
          {/* Preço flexível para este plano */}
          <ul className={styles.featuresList}>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Tudo do Plano
              Profissional
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Hunting exclusivo
              (hunting passivo e ativo)
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Mapeamento de
              mercado
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Avaliação de testes
              técnicos personalizados
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Consultoria de R&S
              dedicada
            </li>
            <li>
              <FaCheckCircle className={styles.checkIcon} /> Garantia de 90 dias
            </li>
          </ul>
          <Button
            variant="accent"
            size="large"
            fullWidth
            onClick={() => handleContactClick("Premium")}
          >
            Solicitar Contato
          </Button>
        </div>
      </div>

      <p className={styles.note}>
        *Os valores são sobre o salário mensal proposto por vaga contratada.
        Para grandes volumes ou pacotes personalizados, entre em contato para
        uma proposta exclusiva.
      </p>
    </section>
  );
};

export default PricingSection;
