// src/modules/Home/PlatformSection/PlatformSection.tsx
import { PrimaryButton } from '@/components/button/PrimaryButton';
import { ModalVideoRM } from '@/components/modal/ModalVideoRM';
import { useModal } from '@/hook/useModal';
import Image from 'next/image';
import React from 'react';

const PlatformSection: React.FC = () => {
  const {
    isOpen: isVideoModalOpen,
    openModal: openVideoModal,
    closeModal: closeVideoModal,
  } = useModal();

  return (
    <section
      id="platform-section"
      className="max-w-[1420px] mx-auto text-center"
    >
      <h2 className="text-primary text-[2.5rem] font-bold mb-2 md:text-[2rem]">
        Nossa Plataforma de Médicos: A Revolução no Recrutamento!
      </h2>
      <p className="text-lg text-secondary mb-12 max-w-[800px] mx-auto md:text-lg">
        Conectamos você aos melhores talentos da área da saúde de forma rápida,
        eficiente e inteligente.
      </p>

      <div className="flex flex-row gap-24 items-center text-left max-lg:flex-col max-lg:text-center">
        <div className="flex-1 min-w-[300px] max-lg:order-[-1] max-lg:mb-8">
          <Image
            src="/images/platform-overview.png"
            alt="Visão geral da plataforma Aura"
            width={600}
            height={400}
            className="rounded-2xl shadow-md"
          />
        </div>
        <div className="flex-1 flex flex-col w-full">
          <h3 className="text-[1.75rem] text-primary font-semibold mb-6 max-lg:text-center">
            Agilidade e Precisão na sua Busca por Médicos e Especialistas na
            área da Saúde
          </h3>
          <p className="text-secondary mb-8 max-lg:text-center md:text-lg">
            Nossa plataforma exclusiva foi desenvolvida para otimizar o seu
            processo de recrutamento de Profissionais da área da Saúde e
            Médicos. Com filtros avançados e um algoritmo de &#34;match
            perfeito&#34;, garantimos que você encontre o profissional ideal
            para a sua equipe em tempo recorde, sem burocracia e com a segurança
            que sua empresa merece.
          </p>
          <p className=" text-secondary mb-8 max-lg:text-center md:text-lg">
            Chega de buscas demoradas e candidatos desalinhados, falta de opções
            para encontraros profissionáis necessários. Na Aura, a tecnologia
            trabalha a seu favor, proporcionando acesso a um banco de dados
            qualificado e atualizado de médicos em todo o Brasil.
          </p>
          <PrimaryButton
            onClick={openVideoModal}
            className="!p-4 text-xl self-center"
          >
            *EM BREVE* Assista ao Vídeo Demonstrativo
          </PrimaryButton>
        </div>
      </div>

      <ModalVideoRM isOpen={isVideoModalOpen} onClose={closeVideoModal} />
    </section>
  );
};

export default PlatformSection;
