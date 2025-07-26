// src/components/Modal/Modal.tsx
import React from 'react';
import styles from './Modal.module.css';
import { FaTimes } from 'react-icons/fa'; // Ícone de fechar

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}> {/* Impede o clique no overlay de fechar o modal */}
        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
          <FaTimes />
        </button>
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;