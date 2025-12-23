import Modal from './Modal';

interface ModalSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  btn?: {
    next?: {
      label: React.ReactNode;
      onClick: () => void;
    };
  };
}

const ModalSuccess: React.FC<ModalSuccessProps> = ({
  isOpen,
  onClose,
  message,
  btn,
}) => {
  return (
    <Modal fit isOpen={isOpen} onClose={onClose} title={message}>
      <div className="flex flex-col items-center justify-center p-2 text-center ">
        <span className="material-icons-outlined text-[100px]! text-red-500">
          delete_forever
        </span>
        {/* <p className="text-gray-600 text-lg">{message}</p> */}

        <div className="flex gap-2">
          {btn?.next && (
            <button
              className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-primary/90 transition-colors"
              onClick={btn?.next?.onClick}
            >
              {btn?.next?.label}
            </button>
          )}
          <button
            className="mt-6 px-6 py-2 bg-secondary text-white rounded-lg hover:bg-primary/90 transition-colors"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSuccess;
