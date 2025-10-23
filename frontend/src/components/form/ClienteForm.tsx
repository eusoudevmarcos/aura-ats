import api from '@/axios';
import EmpresaForm from '@/components/form/EmpresaForm';
import ModalSuccess from '@/components/modal/ModalSuccess';
import {
  clienteWithEmpresaAndPlanosSchema,
  ClienteWithEmpresaAndPlanosSchema,
  ClienteWithEmpresaInput,
} from '@/schemas/cliente.schema';
import { Plano } from '@/schemas/plano.schema';
import { StatusClienteEnum } from '@/schemas/statusClienteEnum.schema';
import { getError } from '@/utils/getError';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
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
function getPlanoIds(planos: any[] | undefined): string[] {
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
}

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loadingPlanos, setLoadingPlanos] = useState(false);
  const isPlanosInitialized = useRef(false);

  // Aplica conversão dos planos e normalização das datas dos representantes
  const normInitialValues = React.useMemo(() => {
    const valuesWithFormattedData =
      normalizeEmpresaDataNascimento(initialValues);
    const initialPlanosIds = getPlanoIds(
      valuesWithFormattedData?.planos as any[] | undefined
    );
    // Remove usuarioSistema se criarUsuarioSistema não for true
    if (!valuesWithFormattedData?.criarUsuarioSistema) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { usuarioSistema, ...rest } = valuesWithFormattedData ?? {};
      return {
        ...rest,
        planos: initialPlanosIds,
      } as Partial<ClienteWithEmpresaAndPlanosSchema>;
    }
    return { ...valuesWithFormattedData, planos: initialPlanosIds };
  }, [initialValues]);

  const methods = useForm<ClienteWithEmpresaAndPlanosSchema>({
    resolver: zodResolver(clienteWithEmpresaAndPlanosSchema),
    mode: 'onBlur',
    defaultValues: normInitialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = methods;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const status = watch('status') || '';
  const planosSelecionadosIds: string[] = (watch('planos') as string[]) || [];
  const criarUsuarioSistema = watch('criarUsuarioSistema');

  // Sempre que initialValues mudar, atualiza os valores correndo datas e usuarioSistema
  useEffect(() => {
    reset(normInitialValues);
    isPlanosInitialized.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialValues)]);

  // Garante que ao receber planos (API) e/ou mudar initialValues do form, os checkboxes sempre reflitam os planos do schema
  useEffect(() => {
    if (!isPlanosInitialized.current && planos.length > 0) {
      setValue(
        'planos',
        getPlanoIds(normInitialValues?.planos as any[] | undefined),
        {
          shouldValidate: false,
          shouldDirty: false,
        }
      );
      isPlanosInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planos, normInitialValues]);

  useEffect(() => {
    const fetchPlanos = async () => {
      setLoadingPlanos(true);
      try {
        const response = await api.get('/api/externalWithAuth/planos');
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

  // Se desmarcar criarUsuarioSistema, limpa usuarioSistema para não enviar indefinido/null no objeto
  useEffect(() => {
    if (!criarUsuarioSistema) {
      setValue('usuarioSistema', undefined, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criarUsuarioSistema]);

  const submitHandler = async (data: ClienteWithEmpresaAndPlanosSchema) => {
    // Ajuste usuarioSistema: só incluir se criarUsuarioSistema estiver marcado
    const { criarUsuarioSistema, usuarioSistema, ...rest } = data;

    const payload: any = {
      ...rest,
      planos: Array.isArray(data.planos)
        ? data.planos.map(planoId => String(planoId))
        : [],
    };

    if (criarUsuarioSistema) {
      payload.criarUsuarioSistema = true;
      if (usuarioSistema) {
        payload.usuarioSistema = usuarioSistema;
      }
    }

    if (onSubmit) onSubmit(payload);

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planos.map(plano => {
                  // Garante comparação consistente dos ids
                  const isSelected = planosSelecionadosIds.includes(
                    String(plano.id)
                  );
                  return (
                    <div
                      key={plano.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-300 hover:border-primary/50'
                      }`}
                      onClick={() => {
                        let newPlanosIds: string[];
                        if (isSelected) {
                          newPlanosIds = planosSelecionadosIds.filter(
                            id => id !== String(plano.id)
                          );
                        } else {
                          newPlanosIds = [
                            ...planosSelecionadosIds,
                            String(plano.id),
                          ];
                        }
                        setValue('planos', newPlanosIds, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            tabIndex={-1}
                            className="w-4 h-4 text-primary pointer-events-none"
                          />
                          <span className="font-medium">{plano.nome}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          R$ {plano.preco}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Tipo: {plano.tipo}</span>
                        {plano.limiteUso && (
                          <span>Limite: {plano.limiteUso} usos</span>
                        )}
                        {plano.diasGarantia && (
                          <span>Garantia: {plano.diasGarantia} dias</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {getError(errors, 'planos') && (
              <p className="text-red-500 text-xs italic mt-2">
                {getError(errors, 'planos')}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="criarUsuarioSistema"
              {...register('criarUsuarioSistema')}
              className="w-4 h-4 text-primary"
            />
            <label
              htmlFor="criarUsuarioSistema"
              className="text-primary font-medium"
            >
              Criar usuário do sistema para este cliente?
            </label>
          </div>

          {criarUsuarioSistema && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <FormInput
                name="usuarioSistema.email"
                label="Email do usuário"
                inputProps={{ type: 'email' }}
              />
              <FormInput
                name="usuarioSistema.password"
                label="Senha (deixe em branco para gerar automaticamente)"
                inputProps={{ type: 'password' }}
              />
            </div>
          )}
        </div>

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
