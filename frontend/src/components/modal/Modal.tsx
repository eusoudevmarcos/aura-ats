// src/components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  title?: string;
}

import { useEffect, useRef, useState } from "react";

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const [show, setShow] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      timeoutRef.current = setTimeout(() => setShow(false), 200);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-md relative w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-transform duration-200 ${
          visible ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 text-white bg-[#8c53ff]">
          {title && <h3 className="text-xl font-semibold ">{title}</h3>}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold ml-auto cursor-pointer"
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
