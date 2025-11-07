import EmpresaForm from '@/components/form/EmpresaForm';
import {
  clienteWithEmpresaAndPlanosSchema,
  ClienteWithEmpresaAndPlanosSchema,
  ClienteWithEmpresaInput,
} from '@/schemas/cliente.schema';

import { saveCliente } from '@/axios/cliente.axios';
import { StatusClienteEnum } from '@/schemas/statusClienteEnum.schema';
import { getError } from '@/utils/getError';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

// IMPORTAÇÃO DO COMPONENTE PlanosForm
import PlanosForm from './planosForm';

type ClienteFormProps = {
  formContexto?: UseFormReturn<ClienteWithEmpresaInput>;
  onSubmit?: (data: ClienteWithEmpresaInput) => void;
  onSuccess?: (data: any) => void;
  initialValues?: Partial<ClienteWithEmpresaAndPlanosSchema>;
  set?: { isProspect: boolean };
};

// Função auxiliar para extrair os ids dos planos
const getPlanoIds = (planos: any[] | undefined): string[] => {
  if (!Array.isArray(planos) || planos.length === 0) return [];
  if (typeof planos[0] === 'string') {
    return planos.map(id => id as string);
  }
  if (typeof planos[0] === 'object' && planos[0] !== null) {
    if ('planoId' in planos[0]) {
      return planos.map((p: any) => String(p.planoId));
    }
    if ('id' in planos[0]) {
      return planos.map((p: any) => String(p.id));
    }
  }
  return [];
};

const ClienteForm: React.FC<ClienteFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
}) => {
  const [loading, setLoading] = useState(false);

  const normInitialValues = React.useMemo(() => {
    // const initialPlanosIds = getPlanoIds(initialValues?.planos);
    return {
      ...initialValues,
      // planos: initialPlanosIds,
    };
  }, [initialValues]);

  const methods = useForm<ClienteWithEmpresaAndPlanosSchema>({
    resolver: zodResolver(clienteWithEmpresaAndPlanosSchema),
    mode: 'onBlur',
    defaultValues: normInitialValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  useEffect(() => {
    // Apenas para debug
    console.log(errors);
  }, [errors]);

  const status = watch('status') || '';
  // const planos = watch('planos') || '';

  const submitHandler = async (data: ClienteWithEmpresaAndPlanosSchema) => {
    const payload: any = {
      ...data,
    };

    if (onSubmit) onSubmit(payload);

    setLoading(true);

    try {
      const response = await saveCliente({ payload });

      if (response.status >= 200 && response.status < 300) {
        onSuccess?.(response.data);
      }
    } catch (erro: any) {
      alert(
        'Erro ao criar cliente: ' +
          (erro?.response?.data?.message || 'Erro não encontrado')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-3 flex flex-col"
      >
        <h3 className="block text-primary text-xl font-bold mb-2">
          Status do cliente
        </h3>
        <FormSelect name="status" placeholder="Selecione o status do Cliente">
          <>
            {StatusClienteEnum.options.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </>
        </FormSelect>

        <label className="block text-primary text-xl font-bold mb-2 border-t border-gray-200 pt-4">
          E-mail de acesso ao sistema
        </label>
        <FormInput
          name="email"
          label="Email do cliente"
          placeholder="exemplo@gmail.com"
          inputProps={{ type: 'email' }}
        />

        <div className="border-t border-gray-200 pt-4">
          <h3 className="block text-primary text-xl font-bold mb-2">Cliente</h3>
          <EmpresaForm namePrefix="empresa" />
          {getError(errors, 'empresa') &&
            typeof getError(errors, 'empresa') === 'string' && (
              <p className="text-red-500 text-xs italic mt-2">
                {getError(errors, 'empresa')}
              </p>
            )}
        </div>

        {status === 'ATIVO' && (
          <div className="border-t border-gray-200 pt-4">
            <PlanosForm
              errors={errors}
              initialValues={initialValues?.planos || []}
              onChange={planosSelecionados => {
                console.log(planosSelecionados);
                setValue('planos', planosSelecionados);
              }}
            />

            {getError(errors, 'planos') && (
              <p className="text-red-500 text-xs italic mt-2">
                {getError(errors, 'planos')}
              </p>
            )}
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <PrimaryButton className="self-end w-full" type="submit">
            {loading
              ? '...loading'
              : initialValues
              ? 'Editar Cliente'
              : 'Cadastrar Cliente'}
          </PrimaryButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default ClienteForm;
