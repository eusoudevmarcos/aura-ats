// src/modules/Home/PricingSection/PricingSection.tsx
import Button from '@/components/site/Button/Button';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa'; // Ícone de check

const PricingSection: React.FC = () => {
  const handleContactClick = (planName: string) => {
    document
      .getElementById('contact-section')
      ?.scrollIntoView({ behavior: 'smooth' });
    alert(
      `Obrigado pelo seu interesse no plano ${planName}! Por favor, preencha o formulário de contato abaixo para que possamos discutir suas necessidades.`
    );
  };

  return (
    <section
      id="pricing-section"
      className="max-w-[1420px] mx-auto text-center bg-bg-color-light text-text-color-primary md:px-4 py-16"
    >
      <h2 className="font-black text-2xl md:text-4xl text-primary">
        Planos de Contratação: Encontre o Talento Ideal para Seu Orçamento
      </h2>
      <p className="text-lg text-text-color-secondary mb-16 max-w-[800px] mx-auto">
        A Take It oferece soluções flexíveis de recrutamento e seleção para
        atender às necessidades específicas da sua empresa, seja qual for o
        tamanho da sua demanda.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {/* Plano Básico */}
        <div className="rounded-lg p-8 shadow-md flex flex-col items-center text-center border border-primary transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg bg-white">
          <h3 className="text-primary text-2xl font-bold mb-1">
            Plano Essencial
          </h3>
          <p className="text-sm text-text-color-secondary mb-4 min-h-[2em]">
            Ideal para primeiras contratações
          </p>
          <p className="text-3xl font-bold text-accent mb-8">
            60%/Salário
            <span className="text-base font-normal text-text-color-secondary">
              /vaga
            </span>
          </p>
          <ul className="list-none p-0 text-left w-full mb-8 flex-grow">
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Publicação de vaga
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Triagem inicial de currículos
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Entrevistas com 3 candidatos finalistas
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Suporte via e-mail
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Garantia de 30 dias
            </li>
          </ul>
          <Button
            variant="accent"
            size="large"
            fullWidth
            onClick={() => handleContactClick('Essencial')}
          >
            Solicitar Contato
          </Button>
        </div>

        {/* Plano Padrão */}
        <div
          className="
            rounded-lg p-8 shadow-md flex flex-col items-center text-center border border-primary
            transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg
            bg-white
          "
        >
          <h3 className="text-primary text-2xl font-bold mb-1">
            Plano Profissional
          </h3>
          <p className="text-sm text-text-color-secondary mb-4 min-h-[2em]">
            Para volume moderado de contratações
          </p>
          <p className="text-3xl font-bold text-accent mb-8">
            80%/Salário
            <span className="text-base font-normal text-text-color-secondary">
              /vaga
            </span>
          </p>
          <ul className="list-none p-0 text-left w-full mb-8 flex-grow">
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Tudo do Plano Essencial
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Avaliação de perfil comportamental
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Entrevistas com 5 candidatos finalistas
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Headhunting estratégico
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Suporte prioritário
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Garantia de 60 dias
            </li>
          </ul>
          <Button
            variant="primary" // Destaque para este plano
            size="large"
            fullWidth
            onClick={() => handleContactClick('Profissional')}
          >
            Solicitar Contato
          </Button>
        </div>

        {/* Plano Premium */}
        <div
          className="
            rounded-lg p-8 shadow-md flex flex-col items-center text-center border border-primary
            transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg
            bg-white
          "
        >
          <h3 className="text-primary text-2xl font-bold mb-1">
            Plano Premium
          </h3>
          <p className="text-sm text-text-color-secondary mb-4 min-h-[2em]">
            Solução completa para grandes demandas
          </p>
          <p className="text-3xl font-bold text-accent mb-8">A Consultar</p>
          <ul className="list-none p-0 text-left w-full mb-8 flex-grow">
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />
              Tudo do Plano Profissional
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Hunting exclusivo (hunting passivo e ativo)
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Mapeamento de mercado
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Avaliação de testes técnicos personalizados
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Consultoria de R&S dedicada
            </li>
            <li className="flex items-start gap-2 text-text-color-secondary text-base mb-2">
              <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />{' '}
              Garantia de 90 dias
            </li>
          </ul>
          <Button
            variant="accent"
            size="large"
            fullWidth
            onClick={() => handleContactClick('Premium')}
          >
            Solicitar Contato
          </Button>
        </div>
      </div>

      <p
        className="
          text-sm text-text-color-secondary mt-16 text-center
        "
      >
        *Os valores são sobre o salário mensal proposto por vaga contratada.
        Para grandes volumes ou pacotes personalizados, entre em contato para
        uma proposta exclusiva.
      </p>
    </section>
  );
};

export default PricingSection;
