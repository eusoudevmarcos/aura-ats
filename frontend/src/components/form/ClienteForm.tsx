import api from '@/axios';
import EmpresaForm from '@/components/form/EmpresaForm';
import ModalSuccess from '@/components/modal/ModalSuccess';
import {
  ClienteWithEmpresaInput,
  clienteWithEmpresaSchema,
} from '@/schemas/cliente.schema';
import { StatusClienteEnum } from '@/schemas/statusClienteEnum.schema';
import { TipoServicoEnum } from '@/schemas/tipoServicoEnum.schema';
import { getError } from '@/utils/getError';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormSelect } from '../input/FormSelect';

type ClienteFormProps = {
  formContexto?: UseFormReturn<ClienteWithEmpresaInput>;
  onSubmit?: (data: ClienteWithEmpresaInput) => void;
  onSuccess?: (data: any) => void;
  initialValues?: Partial<ClienteWithEmpresaInput>;
  set?: { isProspect: boolean };
};

const ClienteForm: React.FC<ClienteFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
}) => {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const methods = useForm<ClienteWithEmpresaInput>({
    resolver: zodResolver(clienteWithEmpresaSchema),
    mode: 'onBlur',
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const submitHandler = async (data: ClienteWithEmpresaInput) => {
    if (onSubmit) onSubmit(data);

    const payload: ClienteWithEmpresaInput = {
      ...data,
    } as ClienteWithEmpresaInput;

    setLoading(true);

    try {
      const response = await api.post(
        '/api/externalWithAuth/cliente/save',
        payload
      );
      if (response.status >= 200 && response.status < 300) {
        const isEdit = !!initialValues?.id;
        setSuccessMessage(
          isEdit
            ? 'Cliente editado com sucesso!'
            : 'Cliente cadastrado com sucesso!'
        );
        setShowSuccessModal(true);
        onSuccess?.(response.data);
      }
    } catch (erro: any) {
      alert(
        'Erro ao criar cliente: ' + erro?.response?.data?.message ||
          'Erro não encontrado'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(submitHandler as any)}
        className="space-y-6 flex flex-col"
      >
        <FormSelect
          label="Tipo de cliente"
          name="status"
          placeholder="Selecione o status do Cliente"
        >
          <>
            {StatusClienteEnum.options.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </>
        </FormSelect>

        <div>
          <h3 className="text-md font-bold">Representante</h3>
          <EmpresaForm namePrefix="empresa" />
        </div>

        <label className="block text-primary text-xl font-bold mb-2">
          Tipo de Serviço:
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TipoServicoEnum.options.map(serv => (
            <label key={serv} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                value={serv}
                {...register('tipoServico')}
              />
              <span>{serv.replaceAll('_', ' ')}</span>
            </label>
          ))}
        </div>

        {getError(errors, 'tipoServico') && (
          <p className="text-red-500 text-xs italic">
            {getError(errors, 'tipoServico')}
          </p>
        )}
        <PrimaryButton className="self-end w-full" type="submit">
          {loading
            ? '...loading'
            : initialValues
            ? 'Editar Cliente'
            : 'Cadastrar Cliente'}
        </PrimaryButton>
      </form>

      <ModalSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </FormProvider>
  );
};

export default ClienteForm;
