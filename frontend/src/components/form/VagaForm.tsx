// src/components/form/VagaForm.tsx
import api from '@/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import {
  FormProvider,
  useForm,
  UseFormReturn,
  useWatch,
} from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';
// import Card from "@/components/Card"; // Comentado no seu código, mantendo
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';
import { FormTextarea } from '../input/FormTextarea';

import {
  BeneficioInput,
  CategoriaVagaEnum,
  HabilidadeInput,
  NivelExigidoEnum,
  NivelExperienciaEnum,
  StatusVagaEnum,
  TipoContratoEnum,
  TipoHabilidadeEnum,
  VagaInput,
  vagaSchema,
} from '@/schemas/vaga.schema';
import { FormArrayInput } from '../input/FormArrayInput';
import ClienteSearch from '../search/ClienteSearch';
import LocalizacaoForm from './LocalizacaoForm';

type VagaFormProps = {
  formContexto?: UseFormReturn<VagaInput>;
  onSubmit?: (data: VagaInput) => void;
  onSuccess?: (data: any) => void;
  initialValues?: Partial<VagaInput>;
};

const VagaForm: React.FC<VagaFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
}) => {
  const [loading, setLoading] = useState(false);
  const [habilidadesAllow, setHabilidadesAllow] = useState(false);
  const [beneficiosAllow, setBeneficiosAllow] = useState(false);
  // const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([]);

  const methods = useForm<VagaInput>({
    resolver: zodResolver(vagaSchema) as any,
    mode: 'onChange',
    defaultValues: {
      ...initialValues,
      tipoSalario: 'A COMBINAR',
      categoria: 'SAUDE',
      status: 'ATIVA',
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const tipoSalario = useWatch({
    control,
    name: 'tipoSalario',
    defaultValue: initialValues?.tipoSalario,
  });

  const categoria = useWatch({
    control,
    name: 'categoria',
    defaultValue: initialValues?.categoria,
  });

  const submitHandler = async (data: any) => {
    console.log('aqui');
    if (onSubmit) onSubmit(data);

    const payload: VagaInput = { ...data };

    setLoading(true);

    try {
      const url = '/api/external/vaga';
      // const endpoint = payload.id ? `${url}` : url;

      const response = await api.post(url, payload);
      if (response.status >= 200 && response.status < 300) {
        onSuccess?.(response.data);
        alert('Vaga salva com sucesso!');
      }
    } catch (erro: any) {
      console.log('Erro ao salvar vaga:', erro);
    } finally {
      setLoading(false);
    }
  };

  const onSuccessClienteSearch = (cliente: any) => {
    setValue('clienteId', cliente.id);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(submitHandler as any)}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-1 space-y-2"
      >
        <div className="col-span-full">
          <ClienteSearch
            onSuccess={onSuccessClienteSearch}
            initialValuesProps={{
              empresa: { ...initialValues?.cliente?.empresa },
              clienteId: initialValues?.clienteId,
            }}
          />
        </div>

        <FormInput
          name="titulo"
          register={register}
          label="Título da Vaga"
          placeholder="Ex: Medico residente"
          errors={errors}
          inputProps={{ classNameContainer: 'col-span-full' }}
        />

        <FormSelect
          name="tipoSalario"
          register={register}
          label="Tipo de salário"
          placeholder="Selecione o tipo de salário"
        >
          <>
            <option value="A COMBINAR">A COMBINAR</option>
            <option value="DIARIA">DIARIA</option>
            <option value="MENSAL">MENSAL</option>
          </>
        </FormSelect>

        {tipoSalario !== 'A COMBINAR' && (
          <FormInput
            name="salario"
            register={register}
            label="Salário"
            inputProps={{ type: 'number', step: '0.01' }}
          />
        )}

        <FormSelect
          name="categoria"
          register={register}
          errors={errors}
          label="Categoria da Vaga"
          placeholder="Selecione o categoria"
        >
          <>
            {CategoriaVagaEnum.options.map(cat => (
              <option key={cat} value={cat}>
                {cat.replaceAll('_', ' ')}
              </option>
            ))}
          </>
        </FormSelect>

        <FormSelect
          name="status"
          register={register}
          errors={errors}
          label="Status da Vaga"
        >
          <>
            {StatusVagaEnum.options.map(stat => (
              <option key={stat} value={stat}>
                {stat.replaceAll('_', ' ')}
              </option>
            ))}
          </>
        </FormSelect>

        <FormSelect
          name="tipoContrato"
          register={register}
          label="Tipo de Contrato"
          placeholder="Selecione o tipo de contratação"
        >
          <>
            {TipoContratoEnum.options.map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo.replaceAll('_', ' ')}
              </option>
            ))}
          </>
        </FormSelect>

        {categoria !== 'SAUDE' && (
          <FormSelect
            name="nivelExperiencia"
            register={register}
            errors={errors}
            label="Nível de Experiência"
            placeholder="Selecione o nível de experiência"
          >
            <>
              {NivelExperienciaEnum.options.map(nivel => (
                <option key={nivel} value={nivel}>
                  {nivel.replaceAll('_', ' ')}
                </option>
              ))}
            </>
          </FormSelect>
        )}

        <FormTextarea
          name="descricao"
          register={register}
          label="Descrição da Vaga"
          placeholder="Ex: Medico residente com mais de 5 anos de experiência"
          errors={errors}
          textareaProps={{ classNameContainer: 'col-span-full' }}
        />

        {/* <FormTextarea
          name="requisitos"
          register={register}
          label="Requisitos (Opcional)"
          placeholder="Ex: 5 anos de experiência, ter RQN."
          errors={errors}
          textareaProps={{ classNameContainer: 'col-span-full', rows: 2 }}
        />

        <FormTextarea
          name="responsabilidades"
          register={register}
          label="Responsabilidades (Opcional)"
          placeholder="Ex: Atuar como médico em clinicas locais."
          errors={errors}
          textareaProps={{ classNameContainer: 'col-span-full', rows: 2 }}
        /> */}

        <div className="col-span-full">
          <LocalizacaoForm namePrefix="localizacao" />
        </div>

        <div className="w-full flex gap-2 items-center col-span-full justify-center">
          <button
            className="flex items-center bg-primary text-white text-sm px-3 py-1 rounded-lg shadow-md text-nowrap"
            onClick={() => {
              setHabilidadesAllow(!habilidadesAllow);
            }}
          >
            Adicionar Habilidades?
          </button>
          <button
            className="flex items-center bg-primary text-white text-sm px-3 py-1 rounded-lg shadow-md text-nowrap"
            onClick={() => {
              setBeneficiosAllow(!beneficiosAllow);
            }}
          >
            Adicionar Beneficios?
          </button>
        </div>

        {habilidadesAllow && (
          <div className="col-span-full">
            <FormArrayInput
              name="habilidades"
              title="Habilidades Necessárias (Opcional)"
              addButtonText="Adicionar Habilidade"
              fieldConfigs={[
                {
                  name: 'nome',
                  placeholder: 'Nome da Habilidade',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'tipoHabilidade',
                  placeholder: 'Tipo',
                  component: 'select',
                  selectOptions: TipoHabilidadeEnum.options.map(opt => ({
                    value: opt,
                    label: opt.replaceAll('_', ' '),
                  })),
                },
                {
                  name: 'nivelExigido',
                  placeholder: 'Nível',
                  component: 'select',
                  selectOptions: NivelExigidoEnum.options.map(opt => ({
                    value: opt,
                    label: opt.replaceAll('_', ' '),
                  })),
                },
              ]}
              renderChipContent={(habilidade: HabilidadeInput) => (
                <>
                  <span>{habilidade.nome}</span>
                  {habilidade.tipoHabilidade && (
                    <span className="ml-1 opacity-80 text-primary">
                      ({String(habilidade.tipoHabilidade).replaceAll('_', ' ')})
                    </span>
                  )}
                  {habilidade.nivelExigido && (
                    <span className="ml-1 opacity-80 text-primary">
                      [{String(habilidade.nivelExigido).replaceAll('_', ' ')}]
                    </span>
                  )}
                </>
              )}
              initialItemData={{
                nome: '',
                tipoHabilidade: '',
                nivelExigido: '',
              }}
            />
          </div>
        )}
        {beneficiosAllow && (
          <div className="col-span-full">
            <FormArrayInput
              name="beneficios"
              title="Benefícios Oferecidos (Opcional)"
              addButtonText="Adicionar Benefício"
              fieldConfigs={[
                {
                  name: 'nome',
                  placeholder: 'Nome do Benefício',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'descricao',
                  placeholder: 'Descrição',
                  type: 'text',
                },
              ]}
              renderChipContent={(beneficio: BeneficioInput) => (
                <>
                  <span className="text-primary">{beneficio.nome}</span>
                  {beneficio.descricao && (
                    <span className="ml-1 opacity-80 text-primary">
                      : {beneficio.descricao}
                    </span>
                  )}
                </>
              )}
              initialItemData={{ nome: '', descricao: '' }}
            />
          </div>
        )}

        <div className="flex justify-end col-span-full">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Vaga'}
          </PrimaryButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default VagaForm;
