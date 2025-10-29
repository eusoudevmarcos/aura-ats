import EmpresaForm from '@/components/form/EmpresaForm';
import {
  clienteWithEmpresaAndPlanosSchema,
  ClienteWithEmpresaAndPlanosSchema,
  ClienteWithEmpresaInput,
} from '@/schemas/cliente.schema';

import { getError } from '@/utils/getError';

import { saveCliente } from '@/axios/cliente.axios';
import { getPlanos } from '@/axios/plano.axios';
import { Plano, PlanoCategoriaEnum } from '@/schemas/plano.schema';
import { StatusClienteEnum } from '@/schemas/statusClienteEnum.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

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

// Corrige datas dos representantes no initialValues
function normalizeEmpresaDataNascimento(
  initialVals?: Partial<ClienteWithEmpresaAndPlanosSchema>
): Partial<ClienteWithEmpresaAndPlanosSchema> {
  if (
    !initialVals?.empresa ||
    !Array.isArray(initialVals.empresa.representantes)
  ) {
    return initialVals || {};
  }

  const empresa = {
    ...initialVals.empresa,
    representantes: initialVals.empresa.representantes.map((repr: any) => {
      let { dataNascimento } = repr;
      if (
        typeof dataNascimento === 'string' &&
        dataNascimento.length &&
        !/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento)
      ) {
        // Tenta converter de ISO para DD/MM/AAAA caso possível
        // Aceita "yyyy-MM-dd" ou "yyyy-MM-ddTHH:mm:ss...", pega os 10 primeiros caracteres
        const iso = dataNascimento.slice(0, 10);
        const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (match) {
          dataNascimento = `${match[3]}/${match[2]}/${match[1]}`;
        }
      }
      return { ...repr, dataNascimento };
    }),
  };
  return { ...initialVals, empresa };
}

const ClienteForm: React.FC<ClienteFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
}) => {
  const [loading, setLoading] = useState(false);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loadingPlanos, setLoadingPlanos] = useState(false);
  const [categoria, setCategoria] = useState<string>('');
  const normInitialValues = React.useMemo(() => {
    const valuesWithFormattedData =
      normalizeEmpresaDataNascimento(initialValues);
    const initialPlanosIds = getPlanoIds(valuesWithFormattedData?.planos);

    return {
      // ...valuesWithFormattedData,
      planos: initialPlanosIds,
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
  } = methods;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const status = watch('status') || '';

  useEffect(() => {
    const fetchPlanos = async () => {
      setLoadingPlanos(true);
      try {
        const response = await getPlanos();
        setPlanos(response.data.data || []);
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
        setPlanos([]);
      } finally {
        setLoadingPlanos(false);
      }
    };
    fetchPlanos();
  }, []);

  const submitHandler = async (data: ClienteWithEmpresaAndPlanosSchema) => {
    const payload: any = {
      ...data,
      planos: getPlanoIds(data.planos.map(planoId => String(planoId))),
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

        <div>
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
          <div>
            <label className="block text-primary text-xl font-bold mb-2">
              Planos do Cliente:
            </label>

            {loadingPlanos ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-primary">Carregando planos...</span>
              </div>
            ) : (
              <>
                {PlanoCategoriaEnum && (
                  <FormSelect
                    name=""
                    label="Selecione"
                    placeholder="SELECIONE A CATEGORIA DO PLANO"
                    selectProps={{
                      onChange: e => {
                        setCategoria(e.target.value);
                      },
                      value: categoria,
                    }}
                  >
                    <>
                      {PlanoCategoriaEnum.options.map((categoria: string) => (
                        <option key={categoria} value={categoria}>
                          {categoria.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </>
                  </FormSelect>
                )}
                {planos && categoria && (
                  <FormSelect
                    name="planos[0]"
                    label="Selecione o tipo de plano"
                    placeholder="Selecione"
                  >
                    <>
                      {planos.map(
                        (plano: Plano) =>
                          plano.categoria === categoria && (
                            <option key={plano.id} value={plano.id}>
                              {plano.nome.replace('1 VAGA', '')} -{' '}
                              {categoria.includes('PLATAFORMA')
                                ? `${plano.limiteUso} ações/mês`
                                : categoria.includes('DIVERSOS')
                                ? 'percentual'
                                : `R$ ${plano.preco}`}
                            </option>
                          )
                      )}
                    </>
                  </FormSelect>
                )}

                {categoria.includes('RECRUTAMENTO') && (
                  <FormInput
                    name="qtdVagas"
                    value={1}
                    label="Quantidade de vagas"
                    maskProps={{ mask: '0000' }}
                    inputProps={{
                      defaultValue: 1,
                      type: 'number',
                      min: 1,
                      max: 1000,
                    }}
                  ></FormInput>
                )}
              </>
            )}
            {getError(errors, 'planos') && (
              <p className="text-red-500 text-xs italic mt-2">
                {getError(errors, 'planos')}
              </p>
            )}
          </div>
        )}

        <label className="block text-primary text-xl font-bold mb-2">
          E-mail de acesso ao sistema
        </label>
        <FormInput
          name="email"
          label="Email do cliente"
          placeholder="exemplo@gmail.com"
          inputProps={{ type: 'email' }}
        />

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
