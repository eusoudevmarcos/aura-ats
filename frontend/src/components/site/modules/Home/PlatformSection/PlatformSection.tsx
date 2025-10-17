// src/modules/Home/PlatformSection/PlatformSection.tsx
import Button from '@/components/site/Button/Button';
import Modal from '@/components/site/Modal/Modal';
import VideoPlayer from '@/components/site/VideoPlayer/VideoPlayer';
import { useModal } from '@/hook/useModal';
import Image from 'next/image';
import React, { useState } from 'react';

const PlatformSection: React.FC = () => {
  const {
    isOpen: isVideoModalOpen,
    openModal: openVideoModal,
    closeModal: closeVideoModal,
  } = useModal();
  const {
    isOpen: isPlansModalOpen,
    openModal: openPlansModal,
    closeModal: closePlansModal,
  } = useModal();

  const {
    isOpen: isModalPlans,
    openModal: openModalPlans,
    closeModal: closeModalPlans,
  } = useModal();

  const [selectedPlan, setSelectedPlan] = useState<null | {
    name: string;
    price: string;
  }>(null);

  const handleOpenPlansModal = () => {
    closeVideoModal();
    openModalPlans();
  };

  const handleSelectPlan = (planName: string, price: string) => {
    setSelectedPlan({ name: planName, price });
  };

  const handleCloseSelectedPlanModal = () => {
    setSelectedPlan(null);
  };

  return (
    <section
      id="platform-section"
      className="max-w-[1420px] mx-auto text-center"
    >
      <h2 className="text-primary text-[2.5rem] font-bold mb-6 md:text-[2rem]">
        Nossa Plataforma de Médicos: A Revolução no Recrutamento!
      </h2>
      <p className="text-lg text-secondary mb-12 max-w-[800px] mx-auto md:text-base">
        Conectamos você aos melhores talentos da área da saúde de forma rápida,
        eficiente e inteligente.
      </p>

      <div className="flex flex-row gap-24 items-center mt-16 text-left max-lg:flex-col max-lg:text-center">
        <div className="flex-1 min-w-[300px] max-lg:order-[-1] max-lg:mb-8">
          <Image
            src="/images/platform-overview.png"
            alt="Visão geral da plataforma Aura"
            width={600}
            height={400}
            layout="responsive"
            className="rounded-2xl shadow-md"
          />
        </div>
        <div className="flex-1 w-full">
          <h3 className="text-[1.75rem] text-primary font-semibold mb-6 max-lg:text-center">
            Agilidade e Precisão na sua Busca por Médicos e Especialistas na
            área da Saúde
          </h3>
          <p className="text-base text-secondary mb-8 max-lg:text-center">
            Nossa plataforma exclusiva foi desenvolvida para otimizar o seu
            processo de recrutamento de Profissionais da área da Saúde e
            Médicos. Com filtros avançados e um algoritmo de &#34;match
            perfeito&#34;, garantimos que você encontre o profissional ideal
            para a sua equipe em tempo recorde, sem burocracia e com a segurança
            que sua empresa merece.
          </p>
          <p className="text-base text-secondary mb-8 max-lg:text-center">
            Chega de buscas demoradas e candidatos desalinhados, falta de opções
            para encontraros profissionáis necessários. Na Aura, a tecnologia
            trabalha a seu favor, proporcionando acesso a um banco de dados
            qualificado e atualizado de médicos em todo o Brasil.
          </p>
          <Button
            onClick={openVideoModal}
            variant="primary"
            fullWidth
            size="large"
          >
            *EM BREVE* Assista ao Vídeo Demonstrativo
          </Button>
        </div>
      </div>

      {/* Modal do Vídeo Demonstrativo */}
      <Modal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        title="Plataforma Aura: Tour Completo"
      >
        <div className="flex flex-col items-center">
          {/* Componente de vídeo personalizado com reprodução automática */}
          <div className="relative w-full pb-[56.25%] mb-6 rounded-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <VideoPlayer
                src="https://www.youtube.com/watch?v=SUA_Link_Do_Seu_Video_Aqui"
                title="Vídeo Demonstrativo Plataforma Aura"
                width={560}
                height={315}
                autoplay={true}
                muted={true}
                controls={true}
              />
            </div>
          </div>
          <p className="text-center mb-8 text-secondary text-base">
            Explore todos os recursos da nossa plataforma de recrutamento e veja
            como é fácil encontrar o Profissional perfeito.
          </p>
          <a
            onClick={handleOpenPlansModal}
            href="#planos_medicos"
            className="inline-block bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-[1.1rem] no-underline mt-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 text-center border-0"
            style={{
              background: 'var(--primary-color)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--box-shadow-sm)',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                'var(--box-shadow-md)';
              (e.currentTarget as HTMLAnchorElement).style.transform =
                'translateY(-2px)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                'var(--primary-color)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                'var(--box-shadow-sm)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'none';
            }}
          >
            Quero Contratar a Plataforma Agora!
          </a>
        </div>
      </Modal>

      {/* Modal do Plano Selecionado */}
      <Modal
        isOpen={!!selectedPlan}
        onClose={handleCloseSelectedPlanModal}
        title={selectedPlan ? `Plano Selecionado: ${selectedPlan.name}` : ''}
      >
        <div className="flex flex-col items-center">
          <p className="text-lg text-secondary mb-4">
            Você selecionou o{' '}
            <span className="font-bold">{selectedPlan?.name}</span> (
            {selectedPlan?.price}).
          </p>
          <p className="text-base text-secondary mb-6">
            Em breve, será implementado o processo de assinatura e pagamento
            diretamente pela plataforma.
          </p>
          <Button
            onClick={handleCloseSelectedPlanModal}
            variant="primary"
            size="large"
          >
            Fechar
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isModalPlans}
        title="Planos Plataforma"
        onClose={closeModalPlans}
        classNameContent="max-w-[1200px] p-0"
      >
        <div id="planos_medicos" className="text-center">
          <p className="text-center mb-8 text-secondary text-base">
            Selecione o plano que melhor se adapta às suas necessidades de busca
            por profissionais médicos. Todos os planos incluem acesso completo
            aos filtros e à nossa base de dados qualificada.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center border border-gray-200 transition-shadow duration-300 hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-primary text-xl font-bold mb-2">
                Plano Essencial
              </h3>
              <p className="text-2xl font-bold text-primary mb-2">
                R$ 989,00/mês
              </p>
              <p className="text-base text-accent font-semibold mb-4">
                Até <span className="font-bold">40 pesquisas</span> por mês
              </p>
              <ul className="list-none p-0 mb-8 w-full">
                <li className="flex items-center justify-center text-sm text-secondary mb-1">
                  <span className="text-accent font-bold mr-2">✔</span>
                  Acesso completo à base de médicos
                </li>
                <li className="flex items-center justify-center text-sm text-secondary mb-1">
                  <span className="text-accent font-bold mr-2">✔</span>
                  Filtros de especialidade e localização
                </li>
                <li className="flex items-center justify-center text-sm text-secondary mb-1">
                  <span className="text-accent font-bold mr-2">✔</span>
                  Suporte básico
                </li>
              </ul>
              <Button
                onClick={() => handleSelectPlan('Plano Essencial', 'R$ 989,00')}
                variant="accent"
                size="large"
                fullWidth
              >
                Selecionar Plano
              </Button>
            </div>

            {/* Card do Plano Profissional */}
            <div
              className="
              bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center border border-gray-200 transition-shadow duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-primary text-xl font-bold mb-2">
                Plano Profissional
              </h3>
              <p className="text-2xl font-bold text-primary mb-2">
                R$ 1949,00/mês
              </p>
              <p className="text-base text-accent font-semibold mb-4">
                Até <span className="font-bold">100 pesquisas</span> por mês
              </p>
              <ul className="list-none p-0 mb-8 w-full">
                <li className="flex items-center justify-center text-sm text-secondary mb-1">
                  <span className="text-accent font-bold mr-2">✔</span>
                  Tudo do Plano Essencial
                </li>
                <li className="flex items-center justify-center text-sm text-secondary mb-1">
                  <span className="text-accent font-bold mr-2">✔</span>
                  Suporte prioritário
                </li>
                <li className="flex items-center justify-center text-sm text-secondary mb-1">
                  <span className="text-accent font-bold mr-2">✔</span>
                  Relatórios de atividade
                </li>
              </ul>
              <Button
                onClick={() =>
                  handleSelectPlan('Plano Profissional', 'R$ 1949,00')
                }
                variant="primary"
                size="large"
                fullWidth
              >
                Selecionar Plano
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center border border-gray-200 transition-shadow duration-300 hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-primary text-xl font-bold mb-2">
                Plano Premium
              </h3>
              <p className="text-2xl font-bold text-primary mb-2">
                R$ 2499,00/mês
              </p>
              <p className="text-base text-accent font-semibold mb-4">
                Até <span className="font-bold">150 pesquisas</span> por mês
              </p>
              <ul className="list-none p-0 mb-8 w-full">
                <li className="flex items-center justify-center text-sm text-secondary mb-1">
                  <span className="text-accent font-bold mr-2">✔</span>
                  Tudo do Plano Profissional
                </li>
                <li className="flex items-center justify-center text-sm text-secondary mb-1">
                  <span className="text-accent font-bold mr-2">✔</span>
                  Consultoria especializada (1h/mês)
                </li>
                <li className="flex items-center justify-center text-sm text-secondary mb-1">
                  <span className="text-accent font-bold mr-2">✔</span>
                  Recursos avançados de IA (futuro)
                </li>
              </ul>
              <Button
                onClick={() => handleSelectPlan('Plano Premium', 'R$ 2499,00')}
                variant="accent"
                size="large"
                fullWidth
              >
                Selecionar Plano
              </Button>
            </div>
          </div>

          <p className="text-sm text-secondary mt-12">
            Ao selecionar um plano, você será redirecionado para a área de
            assinatura do termo de contrato e opções de pagamento (PayPal,
            Mercado Pago, etc.).
          </p>
        </div>
      </Modal>
    </section>
  );
};

export default PlatformSection;
