import type { Plan } from '@/dto/data/PLANOS';
import { PLANS_DATA } from '@/dto/data/PLANOS';
import Link from 'next/link';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const handleContactClick = (planKey: string) => {
  document
    .getElementById('contact-section')
    ?.scrollIntoView({ behavior: 'smooth' });
  alert(
    `Obrigado pelo seu interesse no plano! Por favor, preencha o formulário de contato abaixo para que possamos discutir suas necessidades.`
  );
};

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => {
  // Ajuste de exibição do preço conforme definido nos dados
  let priceContent: React.ReactNode;
  if (plan.priceType === 'fixed') {
    priceContent = (
      <>
        {plan.price}
        <span className="text-base font-normal text-text-color-secondary ml-2">
          /vaga
        </span>
      </>
    );
  } else {
    priceContent = <>Personalizado</>;
  }
  return (
    <div
      className="rounded-lg p-8 shadow-md flex flex-col items-center text-center border border-primary transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg bg-white"
      id={plan.name.toLowerCase().replace(/ /g, '_')}
    >
      <h3 className="text-primary text-2xl font-bold mb-1">{plan.name}</h3>
      <p className="text-sm text-text-color-secondary mb-4 min-h-[2em]">
        {plan.subtitle}
      </p>
      <p className="text-3xl font-bold text-accent mb-8">{priceContent}</p>
      <ul className="list-none p-0 text-left w-full mb-8 flex-grow">
        {plan.items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-text-color-secondary text-base mb-2"
          >
            <FaCheckCircle className="text-primary text-lg flex-shrink-0 mt-[3px]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`https://wa.me/5561992483665?text=${encodeURIComponent(
          `Olá, gostaria de saber mais sobre o plano ${plan.name}`
        )}`}
        className="bg-primary p-4 rounded-lg text-white"
      >
        {plan.btnName}
      </Link>
    </div>
  );
};

const PricingSection: React.FC = () => {
  return (
    <section
      id="pricing-section"
      className="max-w-[1420px] mx-auto text-center bg-bg-color-light text-text-color-primary md:px-4 py-16"
    >
      <h2 className="font-black text-4xl text-primary mb-4">
        Planos de Contratação
      </h2>
      <p className="text-lg text-text-color-secondary mb-10 max-w-[800px] mx-auto">
        A Aura oferece soluções flexíveis de recrutamento e seleção para atender
        às necessidades específicas da sua empresa, seja qual for o tamanho da
        sua demanda.
      </p>

      {/* Grupo 0: Recrutamento Médico apenas título/descrição */}
      {PLANS_DATA.map((group, idx) => (
        <React.Fragment key={group.title}>
          {/* Título do grupo */}
          <h2
            className={`text-3xl font-bold max-w-[800px] mx-auto text-primary${
              idx === 0 ? ' mb-10' : ''
            }`}
            id={group.title.toLowerCase().replace(/ /g, '_')}
          >
            {group.title}
          </h2>
          {/* Descrição do grupo, se existir */}
          {group.description && (
            <p className="text-lg text-text-color-secondary mb-10 max-w-[800px] mx-auto">
              {group.description}
            </p>
          )}
          {/* Renderiza os cards se o grupo tiver planos */}
          {group.plans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 mb-10">
              {group.plans.map(plan => (
                <PlanCard key={plan.planKey} plan={plan} />
              ))}
            </div>
          )}
        </React.Fragment>
      ))}

      <p
        className="
          text-sm text-text-color-secondary mt-16 text-center
        "
      >
        *Os valores são por vaga contratada. Para grandes volumes ou pacotes
        personalizados, entre em contato para uma proposta exclusiva.
      </p>
    </section>
  );
};

export default PricingSection;
