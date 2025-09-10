import api from '@/axios';
import { useSafeForm } from '@/hook/useSafeForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';

import Card from '@/components/Card';
import EmpresaForm from '@/components/form/EmpresaForm';
import PessoaForm from '@/components/form/PessoaForm';
import {
  FuncionarioInput,
  funcionarioSchema,
  TipoUsuarioEnum,
} from '@/schemas/funcionario.schema';
import { PessoaInput } from '@/schemas/pessoa.schema';
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
  const methods = useSafeForm<FuncionarioInput>({
    mode: 'independent',
    useFormProps: {
      resolver: zodResolver(funcionarioSchema),
      mode: 'onBlur',
      defaultValues: funcionarioData
        ? {
            ...funcionarioData,
            tipoPessoaOuEmpresa: funcionarioData?.pessoa ? 'pessoa' : 'empresa',
          }
        : {
            tipoUsuario: 'RECRUTADOR',
            email: '',
            password: '',
            funcionario: {
              setor: '',
              cargo: '',
            },
            tipoPessoaOuEmpresa: 'pessoa',
            pessoa: undefined,
            empresa: undefined,
          },
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  // Watch para o tipo de pessoa ou empresa
  const tipoPessoaOuEmpresa = watch('tipoPessoaOuEmpresa') || 'pessoa';

  const setor = makeName<FuncionarioInput>('funcionario', 'setor');
  const cargo = makeName<FuncionarioInput>('funcionario', 'cargo');

  useEffect(() => {
    if (funcionarioData) {
      Object.entries(funcionarioData).forEach(([key, value]) => {
        if (key === 'pessoa' && value) {
          Object.entries(value as PessoaInput).forEach(([k, v]) => {
            setValue(`pessoa.${k}` as any, v);
          });
        } else if (key === 'empresa' && value) {
          Object.entries(value as any).forEach(([k, v]) => {
            setValue(`empresa.${k}` as any, v);
          });
        } else if (key === 'funcionario' && value) {
          Object.entries(value as any).forEach(([k, v]) => {
            setValue(`funcionario.${k}` as any, v);
          });
        } else {
          setValue(key as keyof FuncionarioInput, value as any);
        }
      });
    }
  }, [funcionarioData, setValue]);

  // Limpa os dados quando muda o tipo
  useEffect(() => {
    if (tipoPessoaOuEmpresa === 'pessoa') {
      setValue('empresa', undefined);
    } else {
      setValue('pessoa', undefined);
    }
  }, [tipoPessoaOuEmpresa, setValue]);

  async function onSubmit(data: FuncionarioInput): Promise<void> {
    try {
      // Remove o campo não usado
      const cleanData = { ...data };
      if (data.tipoPessoaOuEmpresa === 'pessoa') {
        delete (cleanData as any).empresa;
      } else {
        delete (cleanData as any).pessoa;
      }

      const isEdit = !!funcionarioData;
      const url = `/api/external/funcionario/save`;

      const response = await api.post(url, cleanData);
      onSuccess(response.data);
    } catch (error: any) {
      onSuccess(false);

      console.log('Erro ao processar funcionário:', error);
      alert(error.response.data.details.message);
    }
  }

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
            register={register}
            label="Senha"
            inputProps={{
              type: 'password',
              classNameContainer: `col-span-2`,
            }}
          />

          <FormInput
            name={setor}
            register={register}
            label="Setor"
            inputProps={{ classNameContainer: 'col-span-2' }}
          />

          <FormInput
            name={cargo}
            register={register}
            label="Cargo"
            inputProps={{ classNameContainer: 'col-span-2' }}
          />
        </Card>

        <Card>
          <FormSelect
            name="tipoPessoaOuEmpresa"
            register={register}
            label="Tipo de Funcionário (Pessoa ou Empresa)*"
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
        >
          {funcionarioData ? 'Salvar Alterações' : 'Cadastrar Funcionário'}
        </PrimaryButton>
      </form>
    </FormProvider>
  );
};
