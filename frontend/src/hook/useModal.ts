// src/hooks/useModal.ts
import { useCallback, useState } from 'react';

interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useModal = (initialState: boolean = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => {
    setIsOpen(true);
    // Previne scroll do body quando modal abre
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Restaura scroll do body quando modal fecha
    document.body.style.overflow = 'unset';
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
    if (isOpen) {
      document.body.style.overflow = 'unset';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [isOpen]);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
