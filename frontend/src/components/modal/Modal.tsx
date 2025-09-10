// src/components/Modal.tsx
import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  backdropClose?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  backdropClose = false,
}) => {
  const [show, setShow] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShow(isOpen);
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);
    }
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    timeoutRef.current = setTimeout(() => {
      setShow(false);
      if (onClose) onClose(false);
    }, 200);
  };

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (backdropClose && modalRef.current && e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-2 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-md relative w-full max-w-2xl max-h-[90vh] overflow-y-scroll transition-transform duration-200 ${
          visible ? 'scale-100' : 'scale-95'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 text-white bg-primary">
          {title && <h3 className="text-xl font-semibold ">{title}</h3>}
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-700 text-2xl font-bold ml-auto cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
