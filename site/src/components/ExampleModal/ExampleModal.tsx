// src/components/ExampleModal/ExampleModal.tsx
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { useModal } from "@/hooks/useModal";
import React from "react";
import styles from "./ExampleModal.module.css";

const ExampleModal: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div className={styles.container}>
      <Button onClick={openModal} variant="primary" size="medium">
        Abrir Modal de Exemplo
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} title="Modal de Exemplo">
        <div className={styles.modalContent}>
          <p>
            Este é um exemplo de modal com efeitos suaves de entrada e saída.
          </p>

          {/* Exemplo de vídeo com reprodução automática */}
          <VideoPlayer
            src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            title="Vídeo de Exemplo"
            width={480}
            height={270}
            autoplay={true}
            muted={true}
            controls={true}
          />

          <p>
            O vídeo acima será reproduzido automaticamente quando o modal abrir.
          </p>

          <div className={styles.buttonGroup}>
            <Button onClick={closeModal} variant="outlined" size="medium">
              Fechar
            </Button>
            <Button
              onClick={() => alert("Ação executada!")}
              variant="primary"
              size="medium"
            >
              Executar Ação
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExampleModal;
