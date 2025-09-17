// src/components/form/FuncionarioForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import api from '@/axios';
import Card from '@/components/Card';
import EmpresaForm from '@/components/form/EmpresaForm';
import PessoaForm from '@/components/form/PessoaForm';
import {
  FuncionarioInput,
  funcionarioSchema,
  TipoUsuarioEnum,
} from '@/schemas/funcionario.schema';
import { makeName } from '@/utils/makeName';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

type FuncionarioFormProps = {
  onSuccess: (msg: any) => void;
  funcionarioData?: Partial<FuncionarioInput>;
};

export const FuncionarioForm = ({
  onSuccess,
  funcionarioData,
}: FuncionarioFormProps) => {
  const [loading, setLoading] = useState(false);
  const defaultValues = useMemo(() => {
    if (funcionarioData) {
      return {
        ...funcionarioData,
        tipoPessoaOuEmpresa: funcionarioData?.pessoa ? 'pessoa' : 'empresa',
      } as FuncionarioInput;
    }
    return {
      tipoPessoaOuEmpresa: 'pessoa',
      funcionario: {
        setor: '',
        cargo: '',
      },
    } as Partial<FuncionarioInput>;
  }, [funcionarioData]);

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

  useEffect(() => {
    if (funcionarioData) {
      reset(defaultValues);
    }
  }, [funcionarioData, reset, defaultValues]);

  useEffect(() => {
    setValue(setor, tipoUsuario, { shouldValidate: true, shouldDirty: true });
    setValue(cargo, tipoUsuario, { shouldValidate: true, shouldDirty: true });
  }, [tipoUsuario, setValue, setor, cargo]);

  useEffect(() => {
    if (tipoPessoaOuEmpresa === 'pessoa') {
      setValue('empresa', undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setValue('pessoa', undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    trigger('tipoPessoaOuEmpresa');
  }, [tipoPessoaOuEmpresa, setValue, trigger]);

  async function onSubmit(data: FuncionarioInput): Promise<void> {
    try {
      const cleanData = {
        ...data,
      };
      // const tipoPessoaOuEmpresa = data.tipoPessoaOuEmpresa;
      if ('tipoPessoaOuEmpresa' in cleanData) {
        delete (cleanData as any).tipoPessoaOuEmpresa;
      }

      // if (tipoPessoaOuEmpresa === 'pessoa') {
      //   Object.assign(cleanData, {
      //     pessoa: {
      //       ...data.pessoa,
      //       dataNascimento: convertDateToPostgres(
      //         data.pessoa?.dataNascimento as string
      //       ),
      //     },
      //   });
      //   delete (cleanData as any).empresa;
      // } else {
      //   Object.assign(cleanData, {
      //     empresa: {
      //       ...data.empresa,
      //       dataAbertura: convertDateToPostgres(
      //         data.empresa?.dataAbertura as string
      //       ),
      //     },
      //   });
      //   delete (cleanData as any).pessoa;
      // }
      setLoading(true);

      const url = `/api/external/funcionario/save`;
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
            selectProps={{ classNameContainer: 'col-span-full' }}
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

          {tipoUsuario !== TipoUsuarioEnum.enum.CLIENTE_ATS &&
          tipoUsuario !== TipoUsuarioEnum.enum.CLIENTE_ATS_CRM &&
          tipoUsuario !== TipoUsuarioEnum.enum.CLIENTE_CRM ? (
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

        <Card title="Tipo de Funcionário (Pessoa ou Empresa)">
          <FormSelect
            name="tipoPessoaOuEmpresa"
            selectProps={{ classNameContainer: 'mb-4' }}
          >
            <>
              <option value="pessoa">Pessoa</option>
              <option value="empresa">Empresa</option>
            </>
          </FormSelect>

          {tipoPessoaOuEmpresa === 'pessoa' && <PessoaForm />}
          {tipoPessoaOuEmpresa === 'empresa' && <EmpresaForm />}
        </Card>

        <PrimaryButton
          type="submit"
          className="w-full text-white font-semibold py-3 rounded-md transition-colors"
          disabled={loading || !isDirty}
        >
          {loading
            ? 'Carregando...'
            : funcionarioData
            ? 'Salvar Alterações'
            : 'Cadastrar Funcionário'}
        </PrimaryButton>
      </form>
    </FormProvider>
  );
};
