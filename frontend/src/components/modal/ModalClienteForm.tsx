import React from 'react';
import ClienteForm from '../form/ClienteForm';
import Modal from './Modal';
import ModalSuccess from './ModalSuccess';

type ModalClienteFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: any;
  onSuccess?: (cliente: any) => void;
};

const ModalClienteForm: React.FC<ModalClienteFormProps> = ({
  isOpen,
  onClose,
  initialValues,
  onSuccess,
}) => {
  const [showModalSucess, setShowModalSucess] = React.useState(false);
  const [showModalClienteForm, setShowModalClienteForm] = React.useState(false);

  return (
    <>
      <Modal
        isOpen={isOpen || showModalClienteForm}
        onClose={() => setShowModalClienteForm(prev => !prev)}
        title="Editar Cliente"
      >
        <ClienteForm
          initialValues={initialValues}
          onSuccess={cliente => {
            onClose?.();
            onSuccess?.(cliente);
            setShowModalSucess(prev => !prev);
          }}
        />
      </Modal>
      <ModalSuccess
        isOpen={showModalSucess}
        onClose={() => {
          onClose?.();
          setShowModalSucess(prev => !prev);
        }}
        message="Cliente Editado com Sucesso"
      />
    </>
  );
};

export default ModalClienteForm;
