import api from '@/axios';
import Card from '@/components/Card';
import EmpresaForm from '@/components/form/EmpresaForm';
import { ClienteInput, clienteSchema } from '@/schemas/cliente.schema';
import { StatusClienteEnum } from '@/schemas/statusClienteEnum.schema';
import { TipoServicoEnum } from '@/schemas/tipoServicoEnum.schema';
import { convertDateToPostgres } from '@/utils/date/convertDateToPostgres';
import { getError } from '@/utils/getError';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormSelect } from '../input/FormSelect';

type ClienteFormProps = {
  formContexto?: UseFormReturn<ClienteInput>;
  onSubmit?: (data: ClienteInput) => void;
  onSuccess?: (data: any) => void;
  initialValues?: Partial<ClienteInput>;
  set?: { isProspect: boolean };
};

const ClienteForm: React.FC<ClienteFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
}) => {
  const [loading, setLoading] = useState(false);

  const methods = useForm<ClienteInput>({
    resolver: zodResolver(clienteSchema),
    mode: 'onBlur',
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const submitHandler = async (data: ClienteInput) => {
    if (onSubmit) onSubmit(data);

    const payload: ClienteInput = { ...data } as ClienteInput;
    if (payload.empresa) {
      const e: any = { ...payload.empresa };
      if (e.dataAbertura) {
        e.dataAbertura = convertDateToPostgres(e.dataAbertura as string);
        e.representantes[0].dataNascimento = convertDateToPostgres(
          e.representantes[0].dataNascimento as string
        );
        payload.empresa = e;
      }
    }
    setLoading(true);

    try {
      const response = await api.post('/api/external/cliente/save', payload);
      if (response.status >= 200 && response.status < 300) {
        onSuccess?.(response.data);
      }
    } catch (erro: any) {
      alert(
        'Erro ao criar cliente: ' + erro?.response?.data?.message ||
          'Erro não encontrado'
      );
    } finally {
      setLoading(true);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(submitHandler as any)}
        className="space-y-6 flex flex-col"
      >
        <FormSelect
          label="Status"
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

        <Card title="Dados da empresa">
          <EmpresaForm namePrefix="empresa" />
        </Card>

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
    </FormProvider>
  );
};

export default ClienteForm;
