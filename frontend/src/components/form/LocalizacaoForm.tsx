import { useSafeForm } from '@/hook/useSafeForm';
import {
  LocalizacaoInput,
  localizacaoSchema,
} from '@/schemas/localizacao.schema';
import { makeName } from '@/utils/makeName';
import { UF_MODEL } from '@/utils/UF';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import React, { useCallback, useRef, useState } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

type Props = {
  namePrefix?: string;
  title?: string;
  onSubmit?: (data: any) => void;
};

interface ViaCep {
  erro?: boolean;
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

const LocalizacaoFormInner: React.FC<{
  methods: UseFormReturn;
  title?: string;
  namePrefix: string;
}> = ({ namePrefix = 'localizacoes[0]', methods }) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const lastProcessedCep = useRef<string | null>(null);

  const cepFieldName = makeName<LocalizacaoInput>(namePrefix, 'cep');
  const cidadeFieldName = makeName<LocalizacaoInput>(namePrefix, 'cidade');
  // const regiaoFieldName = makeName<LocalizacaoInput>(namePrefix, "regiao");
  const complementoFieldName = makeName<LocalizacaoInput>(
    namePrefix,
    'complemento'
  );
  const bairroFieldName = makeName<LocalizacaoInput>(namePrefix, 'bairro');
  const ufFieldName = makeName<LocalizacaoInput>(namePrefix, 'uf');
  const logradouroFieldName = makeName<LocalizacaoInput>(
    namePrefix,
    'logradouro'
  );

  const cepValue = watch(cepFieldName);

  // const descricaoFiledName = makeName<LocalizacaoInput>(
  //   namePrefix,
  //   "descricao"
  // );
  const getLocalization = useCallback(
    async (event: any) => {
      const cep = event.target.value;
      const normalizedCep = cep.replace(/\D/g, '');
      console.log(cep);
      console.log('aqui');

      if (!normalizedCep || normalizedCep.length !== 8) return;
      console.log('aqui');
      // if (lastProcessedCep.current === normalizedCep) {
      //   return;
      // }

      setIsLoadingCep(true);

      try {
        const response = await axios.get<ViaCep>(
          `https://viacep.com.br/ws/${normalizedCep}/json/`
        );
        console.log(response.data);

        if (response.data.erro) {
          console.log('Erro');
          throw new Error('CEP Invalido');
        }

        if (response.data && !response.data.erro) {
          setValue(logradouroFieldName, response.data.logradouro, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(bairroFieldName, response.data.bairro, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(cidadeFieldName, response.data.localidade, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(ufFieldName, response.data.uf, {
            shouldValidate: true,
            shouldDirty: true,
          });
          if (response.data.complemento) {
            setValue(complementoFieldName, response.data.complemento, {
              shouldValidate: true,
              shouldDirty: true,
            });
          } else {
            setValue(complementoFieldName, '', {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
          methods.clearErrors(cepFieldName);
          lastProcessedCep.current = normalizedCep;
        } else {
          setValue(logradouroFieldName, '', {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(bairroFieldName, '', {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(cidadeFieldName, '', {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(ufFieldName, '', {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(complementoFieldName, '', {
            shouldValidate: true,
            shouldDirty: true,
          });

          methods.setError(
            cepFieldName,
            {
              type: 'manual',
              message: 'CEP não encontrado ou inválido.',
            },
            { shouldFocus: true }
          );
          // lastProcessedCep.current = null;
        }
      } catch (error) {
        setValue(logradouroFieldName, '', {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue(bairroFieldName, '', {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue(cidadeFieldName, '', {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue(ufFieldName, '', {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue(complementoFieldName, '', {
          shouldValidate: true,
          shouldDirty: true,
        });
        methods.setError(
          cepFieldName,
          {
            type: 'manual',
            message: 'Erro na consulta do CEP. Tente novamente.',
          },
          { shouldFocus: true }
        );
        // lastProcessedCep.current = null;
      } finally {
        setIsLoadingCep(false);
      }
    },
    [
      setValue,
      methods,
      logradouroFieldName,
      bairroFieldName,
      cidadeFieldName,
      ufFieldName,
      complementoFieldName,
      cepFieldName,
    ]
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-8 gap-x-2">
        <FormInput
          name={cepFieldName}
          register={register}
          label="CEP"
          placeholder="00000-000"
          maskProps={{ mask: '00000-000' }}
          inputProps={{
            classNameContainer: 'col-span-2',
            disabled: isLoadingCep,
          }}
          onChange={getLocalization}
        />

        <FormSelect
          name={ufFieldName}
          register={register}
          errors={errors}
          label="UF"
        >
          {' '}
          <>
            <option value="">Selecione</option>
            {UF_MODEL.map(({ label }) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </>
        </FormSelect>

        <FormInput
          name={cidadeFieldName}
          register={register}
          label="Cidade"
          placeholder="Ex: Taguatinga"
          inputProps={{
            classNameContainer: 'col-span-2',
            disabled: isLoadingCep,
          }}
        />

        <FormInput
          name={bairroFieldName}
          register={register}
          label="Bairro"
          placeholder="Ex: Setor Leste"
          errors={errors}
          inputProps={{
            classNameContainer: 'col-span-3',
            disabled: isLoadingCep,
          }}
        />
        <FormInput
          name={complementoFieldName}
          register={register}
          label="Complemento"
          placeholder="EX: Hospital Santa Lúcia"
          errors={errors}
          inputProps={{
            classNameContainer: 'col-span-6',
            disabled: isLoadingCep,
          }}
        />

        <FormInput
          name={logradouroFieldName}
          register={register}
          label="Logradouro"
          placeholder="Ex: 15"
          errors={errors}
          inputProps={{
            classNameContainer: 'col-span-2',
            disabled: isLoadingCep,
          }}
        />
      </div>
    </>
  );
};

const LocalizacaoForm: React.FC<Props> = ({
  namePrefix = 'localizacoes[0]',
  title = 'Localização (Opcional)',
  onSubmit,
}) => {
  const mode = 'context';
  const methods = useSafeForm({
    mode,
    useFormProps: {
      resolver: zodResolver(localizacaoSchema) as any,
      mode: 'onTouched',
    },
  });

  if (mode !== 'context') {
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(d => onSubmit?.(d))}>
          <LocalizacaoFormInner
            namePrefix={namePrefix}
            title={title}
            methods={methods}
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Salvar Localização
          </button>
        </form>
      </FormProvider>
    );
  }

  return (
    <LocalizacaoFormInner
      namePrefix={namePrefix}
      title={title}
      methods={methods}
    />
  );
};
export default LocalizacaoForm;
