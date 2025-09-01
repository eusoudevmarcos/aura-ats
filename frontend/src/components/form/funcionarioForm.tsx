import api from '@/axios';
import { useSafeForm } from '@/hook/useSafeForm';
import {
  FuncionarioInput,
  funcionarioSchema,
} from '@/schemas/funcionario.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';

import Card from '@/components/Card';
import EmpresaForm from '@/components/form/EmpresaForm';
import PessoaForm from '@/components/form/PessoaForm';
import { PessoaInput } from '@/schemas/pessoa.schema';
import { makeName } from '@/utils/makeName';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

type FuncionarioFormProps = {
  onSuccess: (msg: boolean) => void;
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
      mode: 'onTouched',
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const [tipoPessoaOuEmpresa, setTipoPessoaOuEmpresa] =
    React.useState('pessoa');

  const email = makeName<FuncionarioInput>('usuarioSistema', 'email');
  const senha = makeName<FuncionarioInput>('usuarioSistema', 'senha');
  const setor = makeName<FuncionarioInput>(
    'usuarioSistema.funcionario',
    'setor'
  );
  const cargo = makeName<FuncionarioInput>(
    'usuarioSistema.funcionario',
    'cargo'
  );
  const tipoPessoa = makeName<FuncionarioInput>('usuarioSistema', 'tipoPessoa');

  useEffect(() => {
    if (funcionarioData) {
      Object.entries(funcionarioData).forEach(([key, value]) => {
        if (key === 'pessoa' && value) {
          Object.entries(value as PessoaInput).forEach(([k, v]) => {
            setValue(`pessoa.${k}` as any, v);
          });
        } else if (key === 'empresa' && value) {
          Object.entries(value as PessoaInput).forEach(([k, v]) => {
            setValue(`empresa.${k}` as any, v);
          });
        } else {
          setValue(key as keyof FuncionarioInput, value as any);
        }
      });
    }
  }, [funcionarioData, setValue]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setTipoPessoaOuEmpresa(e.target.value);
  }

  async function onSubmit(data: FuncionarioInput): Promise<void> {
    // Monta os dados para validação e envio
    const validationData: any = { ...data };
    if (data.tipoPessoaOuEmpresa === 'pessoa') {
      Object.assign(validationData.empresa, undefined);
    } else {
      Object.assign(validationData.pessoa, undefined);
    }

    const result = funcionarioSchema.safeParse(validationData);

    if (!result.success) {
      return;
    }

    try {
      const isEdit = !!funcionarioData;
      const url = isEdit
        ? `/api/funcionario/update/${data.tipoPessoaOuEmpresa}`
        : `/api/funcionario/create/${data.tipoPessoaOuEmpresa}`;

      await api.post(url, result.data);

      onSuccess(true);
    } catch (error: any) {
      onSuccess(false);
      console.error('Erro ao criar funcionário:', error);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="max-w-3xl mx-auto bg-white rounded-lg space-y-6"
      >
        <Card
          title="Dados de Acesso"
          classNameContent="grid grid-cols-1 md:grid-cols-4 gap-2"
        >
          <FormSelect
            name={tipoPessoa}
            register={register}
            errors={errors}
            label="Tipo de funcionario"
            selectProps={{
              classNameContainer: 'col-span-4',
              children: (
                <>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MODERADOR">MODERADOR</option>
                  <option value="ATENDENTE">ATENDENTE</option>
                </>
              ),
            }}
          />

          <FormInput
            name={email}
            register={register}
            label="Email de login"
            errors={errors}
          />

          <FormInput
            name={senha}
            register={register}
            label="Senha"
            errors={errors}
          />

          <FormInput
            name={setor}
            register={register}
            label="Setor"
            errors={errors}
          />

          <FormInput
            name={cargo}
            register={register}
            label="Cargo"
            errors={errors}
          />
        </Card>

        <Card>
          <FormSelect
            name="tipoPessoaOuEmpresa"
            label="Tipo de Funcionário (Pessoa ou Empresa)*"
            value={tipoPessoaOuEmpresa}
            onChange={handleChange}
            selectProps={{
              children: (
                <>
                  <option value="pessoa">Pessoa</option>
                  <option value="empresa">Empresa</option>
                </>
              ),
            }}
          />

          {tipoPessoaOuEmpresa === 'pessoa' && <PessoaForm />}

          {tipoPessoaOuEmpresa === 'empresa' && <EmpresaForm />}
        </Card>

        <PrimaryButton
          type="submit"
          className="w-full  text-white font-semibold py-3 rounded-md transition-colors"
        >
          {funcionarioData ? 'Salvar Alterações' : 'Cadastrar Funcionário'}
        </PrimaryButton>
      </form>
    </FormProvider>
  );
};
