// src/components/form/FuncionarioForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import api from '@/axios';
import Card from '@/components/Card';
import EmpresaForm from '@/components/form/EmpresaForm';
import PessoaForm from '@/components/form/PessoaForm';
import Tabs from '@/components/utils/Tabs';
import {
  FuncionarioInput,
  funcionarioSchema,
  TipoUsuarioEnum,
} from '@/schemas/funcionario.schema';
import { makeName } from '@/utils/makeName';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';
import ClienteSearch from '../search/ClienteSearch';

type FuncionarioFormProps = {
  onSuccess: (msg: any) => void;
  initialValues?: Partial<FuncionarioInput>;
};

export const FuncionarioForm = ({
  onSuccess,
  initialValues,
}: FuncionarioFormProps) => {
  const [loading, setLoading] = useState(false);
  const [disabledFieldsEmpresa, setDisabledFieldsEmpresa] = useState(false);
  const [currentTab, setCurrentTab] = useState<
    'Selecionar Cliente' | 'Cadastrar Cliente'
  >('Selecionar Cliente');

  // Ajuste dos valores iniciais para refletir a estrutura correta
  const defaultValues = useMemo(() => {
    if (initialValues) {
      // Ajusta para garantir que pessoa está dentro de funcionario e empresa dentro de cliente
      let tipoPessoaOuEmpresa = 'empresa';
      let funcionario: any = initialValues.funcionario || {};
      let cliente: any = initialValues.cliente || {};

      if ((initialValues as any).pessoa) {
        tipoPessoaOuEmpresa = 'pessoa';
        funcionario = {
          ...funcionario,
          pessoa: (initialValues as any).pessoa,
        };
      }
      if ((initialValues as any).empresa) {
        tipoPessoaOuEmpresa = 'empresa';
        cliente = {
          ...cliente,
          empresa: (initialValues as any).empresa,
        };
      }

      return {
        ...initialValues,
        tipoPessoaOuEmpresa,
        funcionario,
        cliente,
      } as FuncionarioInput;
    }
    return {
      tipoPessoaOuEmpresa: 'funcionario.pessoa',
      funcionario: {
        setor: '',
        cargo: '',
      },
      cliente: {},
    } as Partial<FuncionarioInput>;
  }, [initialValues]);

  const methods = useForm<FuncionarioInput>({
    resolver: zodResolver(funcionarioSchema),
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { isValid, isDirty, errors },
  } = methods;

  const tipoPessoaOuEmpresa = watch('tipoPessoaOuEmpresa');
  const tipoUsuario = watch('tipoUsuario');
  const setor = makeName<FuncionarioInput>('funcionario', 'setor');
  const cargo = makeName<FuncionarioInput>('funcionario', 'cargo');

  const isClienteUsuario =
    tipoUsuario === TipoUsuarioEnum.enum.CLIENTE_ATS ||
    tipoUsuario === TipoUsuarioEnum.enum.CLIENTE_ATS_CRM ||
    tipoUsuario === TipoUsuarioEnum.enum.CLIENTE_CRM;

  useEffect(() => {
    if (initialValues) {
      reset(defaultValues);
    }
  }, [initialValues, reset, defaultValues]);

  useEffect(() => {
    setValue(setor, tipoUsuario, { shouldValidate: true, shouldDirty: true });
    setValue(cargo, tipoUsuario, { shouldValidate: true, shouldDirty: true });

    if (
      tipoUsuario === TipoUsuarioEnum.enum.CLIENTE_ATS ||
      tipoUsuario === TipoUsuarioEnum.enum.CLIENTE_ATS_CRM ||
      tipoUsuario === TipoUsuarioEnum.enum.CLIENTE_CRM
    ) {
      setValue('tipoPessoaOuEmpresa', 'cliente.empresa');
    }
  }, [tipoUsuario, setValue, setor, cargo]);

  useEffect(() => {
    if (tipoPessoaOuEmpresa === 'funcionario.pessoa') {
      // Limpa empresa de dentro de cliente
      setValue('cliente.empresa', undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      // Limpa pessoa de dentro de funcionario
      setValue('funcionario.pessoa', undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    trigger('tipoPessoaOuEmpresa');
  }, [tipoPessoaOuEmpresa, setValue, trigger]);

  async function onSubmit(data: FuncionarioInput): Promise<void> {
    try {
      // Monta o objeto para enviar no formato correto
      const cleanData: any = {
        ...data,
      };

      // Remove campo auxiliar
      if ('tipoPessoaOuEmpresa' in cleanData) {
        delete cleanData.tipoPessoaOuEmpresa;
      }

      // Garante que pessoa está dentro de funcionario e empresa dentro de cliente
      if (tipoPessoaOuEmpresa === 'funcionario.pessoa') {
        // Se existir pessoa fora, move para dentro de funcionario
        if ((cleanData as any).pessoa) {
          cleanData.funcionario = {
            ...cleanData.funcionario,
            pessoa: (cleanData as any).pessoa,
          };
          delete cleanData.pessoa;
        }
        // Remove empresa de cliente se existir
        if (cleanData.cliente && cleanData.cliente.empresa) {
          delete cleanData.cliente.empresa;
        }
      } else if (tipoPessoaOuEmpresa === 'cliente.empresa') {
        // Se existir empresa fora, move para dentro de cliente
        if ((cleanData as any).empresa) {
          cleanData.cliente = {
            ...cleanData.cliente,
            empresa: (cleanData as any).empresa,
          };
          delete cleanData.empresa;
        }
        // Remove pessoa de funcionario se existir
        if (cleanData.funcionario && cleanData.funcionario.pessoa) {
          delete cleanData.funcionario.pessoa;
        }
      }

      setLoading(true);

      const url = `/api/externalWithAuth/funcionario/save`;
      const response = await api.post(url, cleanData);
      onSuccess(response.data);
      reset(response.data);
    } catch (error: any) {
      console.log('Erro ao processar funcionário:', error);
      alert(error.response.data.details.message);
    } finally {
      setLoading(false);
    }
  }

  const onSuccessClienteSearch = (cliente: any) => {
    // Seta o id da empresa dentro de cliente
    setValue('cliente.empresa.id', cliente.empresa.id);
    setDisabledFieldsEmpresa(true);
  };

  const onDeleteClienteSearch = () => {
    const currentValues = methods.getValues();
    // Limpa empresa de dentro de cliente
    reset({
      ...currentValues,
      cliente: { ...currentValues.cliente, empresa: undefined },
    });
    setDisabledFieldsEmpresa(false);
  };

  // UseEffect para depurar erros
  useEffect(() => {
    console.log('isValid:', isValid);
    if (Object.keys(errors).length > 0) {
      console.log('Errors:', errors);
    }
  }, [isValid, errors]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="max-w-3xl mx-auto bg-white rounded-lg space-y-6"
        autoComplete="off"
      >
        <Card
          title="Dados de Acesso"
          classNameContent="grid grid-cols-1 md:grid-cols-4 gap-2"
        >
          <FormSelect
            name="tipoUsuario"
            label="Tipo de funcionário"
            selectProps={{
              classNameContainer: 'col-span-full',
            }}
            placeholder="Selecione o Tipo de Usuario"
          >
            <>
              {TipoUsuarioEnum.options.map(tipo => (
                <option key={tipo} value={tipo}>
                  {(() => {
                    switch (tipo) {
                      case 'ADMIN_SISTEMA':
                        return 'Administrador do Sistema';
                      case 'ADMINISTRATIVO':
                        return 'Administrativo';
                      case 'MODERADOR':
                        return 'Moderador (Gerente)';
                      case 'RECRUTADOR':
                        return 'Recrutador';
                      case 'VENDEDOR':
                        return 'Vendedor';
                      case 'CLIENTE_ATS':
                        return 'Cliente ATS';
                      case 'CLIENTE_CRM':
                        return 'Cliente CRM';
                      case 'CLIENTE_ATS_CRM':
                        return 'Cliente ATS + CRM';
                      default:
                        return tipo;
                    }
                  })()}
                </option>
              ))}
            </>
          </FormSelect>

          <FormInput
            name="email"
            label="Email de login"
            inputProps={{ type: 'email', classNameContainer: 'col-span-2' }}
          />

          <FormInput
            name="password"
            label="Senha"
            inputProps={{
              type: 'password',
              classNameContainer: `col-span-2`,
            }}
          />

          {!isClienteUsuario ? (
            <>
              <FormInput
                name={setor}
                label="Setor"
                inputProps={{ classNameContainer: 'col-span-2' }}
              />
              <FormInput
                name={cargo}
                label="Cargo"
                inputProps={{ classNameContainer: 'col-span-2' }}
              />
            </>
          ) : (
            <></>
          )}
        </Card>

        <Card
          title={`Tipo de Funcionário ${
            isClienteUsuario ? '(Cliente)' : '(Pessoa ou Empresa)'
          }`}
        >
          <FormSelect
            name="tipoPessoaOuEmpresa"
            selectProps={{
              classNameContainer: 'mb-4',
              disabled: !tipoUsuario || isClienteUsuario,
            }}
          >
            <>
              {!isClienteUsuario && <option value="pessoa">Pessoa</option>}
              <option value="empresa">
                {isClienteUsuario ? 'Cliente' : 'Empresa'}
              </option>
            </>
          </FormSelect>

          {/* Renderização condicional dos formulários de acordo com a estrutura correta */}
          {tipoPessoaOuEmpresa === 'cliente.empresa' && isClienteUsuario ? (
            <Tabs
              tabs={['Pesquisar Cliente', 'Cadastrar Cliente']}
              currentTab={currentTab}
              classNameContainer="mt-4"
              classNameTabs="mb-2"
              classNameContent="pt-2"
              onTabChange={tab => setCurrentTab(tab as typeof currentTab)}
            >
              <>
                <ClienteSearch
                  onSuccess={onSuccessClienteSearch}
                  initialValuesProps={
                    initialValues?.cliente?.empresa
                      ? {
                          empresa: { ...initialValues?.cliente?.empresa },
                          clienteId: initialValues?.id,
                        }
                      : null
                  }
                  onDelete={onDeleteClienteSearch}
                />
              </>

              <>
                <EmpresaForm
                  namePrefix="cliente.empresa"
                  disabledFields={disabledFieldsEmpresa}
                />
              </>
            </Tabs>
          ) : tipoPessoaOuEmpresa === 'funcionario.pessoa' ? (
            tipoUsuario && <PessoaForm namePrefix="funcionario.pessoa" />
          ) : (
            <>
              <EmpresaForm namePrefix="cliente.empresa" />
            </>
          )}
        </Card>

        <PrimaryButton
          type="submit"
          className="w-full text-white font-semibold py-3 rounded-md transition-colors"
          disabled={loading || !isDirty}
        >
          {loading
            ? 'Carregando...'
            : initialValues
            ? 'Salvar Alterações'
            : 'Cadastrar Funcionário'}
        </PrimaryButton>
      </form>
    </FormProvider>
  );
};
