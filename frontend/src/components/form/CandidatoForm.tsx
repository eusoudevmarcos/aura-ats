import api from '@/axios';
import Card from '@/components/Card';
import LocalizacaoForm from '@/components/form/LocalizacaoForm';
import PessoaForm from '@/components/form/PessoaForm';
import { useSafeForm } from '@/hook/useSafeForm';
import { CandidatoInput, candidatoSchema } from '@/schemas/candidato.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';

import { AreaCandidatoEnum } from '@/schemas/candidato.schema';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';

type CandidatoFormProps = {
  formContexto?: UseFormReturn<CandidatoInput>;
  onSubmit?: (data: CandidatoInput) => void;
  onSuccess?: (data: any) => void;
  initialValues?: Partial<CandidatoInput>;
};

const CandidatoForm: React.FC<CandidatoFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
}) => {
  const [loading, setLoading] = useState(false);
  const [especialidades, setEspecialidades] = useState<
    { id: number; nome: string }[]
  >([]);

  const methods = useSafeForm<CandidatoInput>({
    mode: 'independent',
    useFormProps: {
      resolver: zodResolver(candidatoSchema),
      mode: 'onTouched',
      defaultValues: initialValues,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const fetchEspecialidades = async () => {
    try {
      // Suponha que você tenha um endpoint para buscar especialidades
      const response = await api.get<{ id: number; nome: string }[]>(
        '/api/external/candidato/especialidades'
      );
      setEspecialidades(response.data);
    } catch (error) {
      console.log('Erro ao carregar especialidades:', error);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const submitHandler = async (data: CandidatoInput) => {
    if (onSubmit) onSubmit(data);

    const payload: CandidatoInput = { ...data };

    setLoading(true);

    try {
      const endpoint = payload.id ? `/candidato/${payload.id}` : '/candidato';
      const method = payload.id ? api.put : api.post;

      const response = await method(endpoint, payload);
      if (response.status >= 200 && response.status < 300) {
        onSuccess?.(response.data);
        alert('Profissional salvo com sucesso!');
      }
    } catch (erro: any) {
      alert(
        'Erro ao salvar profissional: ' +
          (erro?.response?.data?.message || 'Erro desconhecido')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler as any)} className="space-y-6">
        <Card title="Dados Pessoais">
          <PessoaForm namePrefix="pessoa" />
        </Card>

        <Card title="Endereço">
          <LocalizacaoForm namePrefix="pessoa.localizacoes[0]" />
        </Card>

        {/* <Card title="Formações Acadêmicas">
          <FormacaoForm namePrefix="" />
        </Card> */}

        <Card title="Dados Profissionais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              name="areaCandidato"
              register={register}
              errors={errors}
              placeholder="Área de atuação"
            >
              <>
                {AreaCandidatoEnum.options.map(area => (
                  <option key={area} value={area}>
                    {area.replaceAll('_', ' ')}
                  </option>
                ))}
              </>
            </FormSelect>

            <FormSelect
              name="especialidadeId"
              errors={errors}
              register={register}
              placeholder="Especialidade"
            >
              <>
                {especialidades.map(esp => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nome}
                  </option>
                ))}
              </>
            </FormSelect>

            <FormInput name="crm" placeholder="CRM" register={register} />
            <FormInput name="corem" placeholder="COREM" register={register} />
            <FormInput name="rqe" placeholder="RQE" register={register} />
          </div>
        </Card>

        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Profissional'}
          </PrimaryButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default CandidatoForm;
