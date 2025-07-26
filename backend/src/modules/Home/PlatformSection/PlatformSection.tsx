// src/modules/Home/PlatformSection/PlatformSection.tsx
import React, { useState } from 'react';
import styles from './PlatformSection.module.css';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import Image from 'next/image'; // Para imagens descritivas na seção

const PlatformSection: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);

  const openPlansModal = () => {
    closeVideoModal(); // Fecha o modal de vídeo antes de abrir o de planos
    setIsPlansModalOpen(true);
  };
  const closePlansModal = () => setIsPlansModalOpen(false);

  const handleSelectPlan = (planName: string, price: string) => {
    // Lógica futura para redirecionar para a área de assinatura/pagamento
    console.log(`Plano selecionado: ${planName} - ${price}. Redirecionando para pagamento...`);
    alert(`Você selecionou o ${planName}. Em breve, será redirecionado para a área de assinatura e pagamento!`);
    closePlansModal();
    // window.location.href = '/checkout-page'; // Exemplo de redirecionamento
  };

  return (
    <section id="platform-section" className={styles.sectionContainer}>
      <h2>Nossa Plataforma de Médicos: A Revolução no Recrutamento!</h2>
      <p className={styles.subtitle}>
        Conectamos você aos melhores talentos da área da saúde de forma rápida, eficiente e inteligente.
      </p>

      <div className={styles.contentGrid}>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/platform-overview.jpg" // Crie uma imagem para a visão geral da plataforma
            alt="Visão geral da plataforma Take It de médicos"
            width={600}
            height={400}
            layout="responsive" // Torna a imagem responsiva
            className={styles.platformImage}
          />
        </div>
        <div className={styles.textWrapper}>
          <h3>Agilidade e Precisão na sua Busca por Talentos Médicos</h3>
          <p>
            Nossa plataforma exclusiva foi desenvolvida para otimizar o seu processo de recrutamento de médicos.
            Com filtros avançados e um algoritmo de "match perfeito", garantimos que você encontre o profissional ideal
            para a sua equipe em tempo recorde, sem burocracia e com a segurança que sua empresa merece.
          </p>
          <p>
            Chega de buscas demoradas e candidatos desalinhados. Na Take It, a tecnologia trabalha a seu favor,
            proporcionando acesso a um banco de dados qualificado e atualizado de médicos em todo o Brasil.
          </p>
          <Button onClick={openVideoModal} variant="primary" size="large" className={styles.callToActionButton}>
            Assista ao Vídeo Demonstrativo
          </Button>
        </div>
      </div>

      {/* Modal do Vídeo Demonstrativo */}
      <Modal isOpen={isVideoModalOpen} onClose={closeVideoModal} title="Plataforma Take It: Tour Completo">
        <div className={styles.videoModalContent}>
          {/* O iframe do YouTube ou Vimeo para o vídeo demonstrativo */}
          <div className={styles.videoWrapper}>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/SUA_Link_Do_Seu_Video_Aqui?autoplay=1" // Substitua pelo link real do seu vídeo e adicione ?autoplay=1
              title="Vídeo Demonstrativo Plataforma Take It"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <p className={styles.modalDescription}>
            Explore todos os recursos da nossa plataforma de recrutamento médico e veja como é fácil encontrar o candidato perfeito.
          </p>
          <Button onClick={openPlansModal} variant="accent" size="medium" fullWidth>
            Quero Contratar a Plataforma Agora!
          </Button>
        </div>
      </Modal>

      {/* Modal de Planos de Contratação */}
      <Modal isOpen={isPlansModalOpen} onClose={closePlansModal} title="Escolha seu Plano Take It">
        <div className={styles.plansModalContent}>
          <p className={styles.modalDescription}>
            Selecione o plano que melhor se adapta às suas necessidades de busca por profissionais médicos.
            Todos os planos incluem acesso completo aos filtros e à nossa base de dados qualificada.
          </p>
          <div className={styles.planCardsContainer}>
            {/* Card do Plano Essencial */}
            <div className={styles.planCard}>
              <h3>Plano Essencial</h3>
              <p className={styles.planPrice}>R$ 499,00/mês</p>
              <p className={styles.planFeature}>Até **300 pesquisas** por mês</p>
              <ul>
                <li>Acesso completo à base de médicos</li>
                <li>Filtros de especialidade e localização</li>
                <li>Suporte básico</li>
              </ul>
              <Button onClick={() => handleSelectPlan('Plano Essencial', 'R$ 499,00')} variant="primary" fullWidth>
                Selecionar Plano
              </Button>
            </div>

            {/* Card do Plano Profissional */}
            <div className={styles.planCard}>
              <h3>Plano Profissional</h3>
              <p className={styles.planPrice}>R$ 749,00/mês</p>
              <p className={styles.planFeature}>Até **700 pesquisas** por mês</p>
              <ul>
                <li>Tudo do Plano Essencial</li>
                <li>Suporte prioritário</li>
                <li>Relatórios de atividade</li>
              </ul>
              <Button onClick={() => handleSelectPlan('Plano Profissional', 'R$ 749,00')} variant="primary" fullWidth>
                Selecionar Plano
              </Button>
            </div>

            {/* Card do Plano Premium */}
            <div className={styles.planCard}>
              <h3>Plano Premium</h3>
              <p className={styles.planPrice}>R$ 899,00/mês</p>
              <p className={styles.planFeature}>Até **1200 pesquisas** por mês</p>
              <ul>
                <li>Tudo do Plano Profissional</li>
                <li>Consultoria especializada (1h/mês)</li>
                <li>Recursos avançados de IA (futuro)</li>
              </ul>
              <Button onClick={() => handleSelectPlan('Plano Premium', 'R$ 899,00')} variant="primary" fullWidth>
                Selecionar Plano
              </Button>
            </div>
          </div>
          <p className={styles.contractNote}>
            Ao selecionar um plano, você será redirecionado para a área de assinatura do termo de contrato e opções de pagamento (PayPal, Mercado Pago, etc.).
          </p>
        </div>
      </Modal>
    </section>
  );
};

export default PlatformSection;