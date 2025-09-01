// src/modules/Home/PlatformSection/PlatformSection.tsx
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { useModal } from "@/hooks/useModal";
import Image from "next/image"; // Para imagens descritivas na seção
import React from "react";
import styles from "./PlatformSection.module.css";

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

  const handleOpenPlansModal = () => {
    closeVideoModal(); // Fecha o modal de vídeo antes de abrir o de planos
    openPlansModal();
  };

  const handleSelectPlan = (planName: string, price: string) => {
    // Lógica futura para redirecionar para a área de assinatura/pagamento
    alert(
      `Você selecionou o ${planName}. Em breve, será redirecionado para a área de assinatura e pagamento!`
    );
    closePlansModal();
    // window.location.href = '/checkout-page'; // Exemplo de redirecionamento
  };

  return (
    <section id="platform-section" className={styles.sectionContainer}>
      <h2>Nossa Plataforma de Médicos: A Revolução no Recrutamento!</h2>
      <p className={styles.subtitle}>
        Conectamos você aos melhores talentos da área da saúde de forma rápida,
        eficiente e inteligente.
      </p>

      <div className={styles.contentGrid}>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/platform-overview.png" // Crie uma imagem para a visão geral da plataforma
            alt="Visão geral da plataforma Aura"
            width={600}
            height={400}
            layout="responsive" // Torna a imagem responsiva
            className={styles.platformImage}
          />
        </div>
        <div className={styles.textWrapper}>
          <h3>
            Agilidade e Precisão na sua Busca por Médicos e Especialistas na
            área da Saúde
          </h3>
          <p>
            Nossa plataforma exclusiva foi desenvolvida para otimizar o seu
            processo de recrutamento de Profissionais da área da Saúde e
            Médicos. Com filtros avançados e um algoritmo de 'match perfeito',
            garantimos que você encontre o profissional ideal para a sua equipe
            em tempo recorde, sem burocracia e com a segurança que sua empresa
            merece.
          </p>
          <p>
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
        <div className={styles.videoModalContent}>
          {/* Componente de vídeo personalizado com reprodução automática */}
          <VideoPlayer
            src="https://www.youtube.com/watch?v=SUA_Link_Do_Seu_Video_Aqui"
            title="Vídeo Demonstrativo Plataforma Aura"
            width={560}
            height={315}
            autoplay={true}
            muted={true}
            controls={true}
          />
          <p className={styles.modalDescription}>
            Explore todos os recursos da nossa plataforma de recrutamento e veja
            como é fácil encontrar o Profissional perfeito.
          </p>
          <a
            onClick={handleOpenPlansModal}
            href="#planos_medicos"
            style={{
              display: "inline-block",
              background: "var(--primary-color)",
              color: "#fff",
              padding: "1rem 2.2rem",
              borderRadius: "var(--border-radius-lg)",
              fontWeight: 600,
              fontSize: "1.1rem",
              textDecoration: "none",
              marginTop: "1.5rem",
              boxShadow: "var(--box-shadow-sm)",
              transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
              cursor: "pointer",
              border: "none",
              textAlign: "center",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "var(--box-shadow-md)";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "var(--primary-color)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "var(--box-shadow-sm)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "none";
            }}
          >
            Quero Contratar a Plataforma Agora!
          </a>
        </div>
      </Modal>

      {/* Modal de Planos de Contratação */}
      {/* <Modal
        isOpen={isPlansModalOpen}
        onClose={closePlansModal}
        title="Escolha seu Plano Aura"
      > */}
      <div id="planos_medicos" className={styles.plansModalContent}>
        <p className={styles.modalDescription}>
          Selecione o plano que melhor se adapta às suas necessidades de busca
          por profissionais médicos. Todos os planos incluem acesso completo aos
          filtros e à nossa base de dados qualificada.
        </p>
        <div className={styles.planCardsContainer}>
          {/* Card do Plano Essencial */}
          <div className={styles.planCard}>
            <h3>Plano Essencial</h3>
            <p className={styles.planPrice}>R$ 989,00/mês</p>
            <p className={styles.planFeature}>Até **40 pesquisas** por mês</p>
            <ul>
              <li>Acesso completo à base de médicos</li>
              <li>Filtros de especialidade e localização</li>
              <li>Suporte básico</li>
            </ul>
            <Button
              onClick={() => handleSelectPlan("Plano Essencial", "R$ 989,00")}
              variant="accent"
              size="large"
              fullWidth
            >
              Selecionar Plano
            </Button>
          </div>

          {/* Card do Plano Profissional */}
          <div className={styles.planCard}>
            <h3>Plano Profissional</h3>
            <p className={styles.planPrice}>R$ 1949,00/mês</p>
            <p className={styles.planFeature}>Até **100 pesquisas** por mês</p>
            <ul>
              <li>Tudo do Plano Essencial</li>
              <li>Suporte prioritário</li>
              <li>Relatórios de atividade</li>
            </ul>
            <Button
              onClick={() =>
                handleSelectPlan("Plano Profissional", "R$ 1949,00")
              }
              variant="primary"
              size="large"
              fullWidth
            >
              Selecionar Plano
            </Button>
          </div>

          {/* Card do Plano Premium */}
          <div className={styles.planCard}>
            <h3>Plano Premium</h3>
            <p className={styles.planPrice}>R$ 2499,00/mês</p>
            <p className={styles.planFeature}>Até **150 pesquisas** por mês</p>
            <ul>
              <li>Tudo do Plano Profissional</li>
              <li>Consultoria especializada (1h/mês)</li>
              <li>Recursos avançados de IA (futuro)</li>
            </ul>
            <Button
              onClick={() => handleSelectPlan("Plano Premium", "R$ 2499,00")}
              variant="accent"
              size="large"
              fullWidth
            >
              Selecionar Plano
            </Button>
          </div>
        </div>
        <p className={styles.contractNote}>
          Ao selecionar um plano, você será redirecionado para a área de
          assinatura do termo de contrato e opções de pagamento (PayPal, Mercado
          Pago, etc.).
        </p>
      </div>
      {/* </Modal> */}
    </section>
  );
};

export default PlatformSection;
