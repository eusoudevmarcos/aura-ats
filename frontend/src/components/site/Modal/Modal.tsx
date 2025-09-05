// src/components/Modal/Modal.tsx
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface Options {
  className?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string | { className: string; label: string };
  options?: Options;
  classNameContent?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  classNameContent,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
      // Habilita o scroll do body quando o modal abre
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      // Aguarda a animação terminar antes de remover o modal
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'unset';
      }, 300); // Duração da animação de saída
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    // Função para fechar o modal com ESC
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[2000] flex justify-center items-center
        p-6 sm:p-3
        transition-colors duration-300
        ${isAnimating ? 'bg-black/70' : 'bg-black/0'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          bg-[var(--secondary-color)]
          rounded-[var(--border-radius-lg)]
          p-8
          relative
          max-w-[600px] w-full
          shadow-[var(--box-shadow-lg)]
          transition-all duration-300
          ${
            isAnimating
              ? 'scale-100 translate-y-0 opacity-100'
              : 'scale-95 translate-y-5 opacity-0'
          }
          ${
            isAnimating
              ? 'animate-[modalSlideIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]'
              : 'animate-[modalSlideOut_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]'
          }
          sm:p-[var(--spacing-md)] sm:m-[var(--spacing-sm)]
        ${classNameContent}`}
        style={{
          animationFillMode: 'forwards',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className={`
            absolute top-[var(--spacing-sm)] right-[var(--spacing-sm)]
            bg-none border-none text-[var(--text-color-secondary)]
            cursor-pointer
            w-8 h-8 flex items-center justify-center rounded-full
            transition-all duration-200
            hover:text-[var(--primary-color)]
            hover:bg-black/10
            hover:scale-110
            active:scale-95
          `}
          onClick={onClose}
          aria-label="Fechar"
          type="button"
        >
          <FaTimes />
        </button>
        {title && (
          <h2
            className={`text-center font-black text-2xl text-primary text-black ${
              typeof title === 'object' && 'className' in title
                ? title.className
                : ''
            }`}
          >
            {typeof title == 'string' ? title : title.label}
          </h2>
        )}
        <div className="max-h-[70vh] overflow-y-auto pr-[var(--spacing-xxs)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
