// src/components/Modal/Modal.tsx
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa"; // Ícone de fechar
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
      // Habilita o scroll do body quando o modal abre
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      // Aguarda a animação terminar antes de remover o modal
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "unset";
      }, 300); // Duração da animação de saída
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    // Função para fechar o modal com ESC
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`${styles.overlay} ${
        isAnimating ? styles.overlayOpen : styles.overlayClose
      }`}
      onClick={onClose}
    >
      <div
        className={`${styles.modalContent} ${
          isAnimating ? styles.modalOpen : styles.modalClose
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar"
        >
          <FaTimes />
        </button>
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
