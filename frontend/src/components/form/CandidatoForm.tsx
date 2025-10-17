import api from '@/axios';
import LocalizacaoForm from '@/components/form/LocalizacaoForm';
import PessoaForm from '@/components/form/PessoaForm';
import ModalSuccess from '@/components/modal/ModalSuccess';
import { CandidatoInput, candidatoSchema } from '@/schemas/candidato.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const defaultValues = !!initialValues
    ? {
        ...initialValues,
        especialidadeId: String(initialValues?.especialidadeId),
      }
    : {
        pessoa: {
          nome: '',
          cpf: '',
          dataNascimento: '',
        },
      };

  const methods = useForm<CandidatoInput>({
    resolver: zodResolver(candidatoSchema),
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const { handleSubmit, watch } = methods;

  const areaCandidato = watch('areaCandidato');
  const especialidadeId = watch('especialidadeId');

  const fetchEspecialidades = async () => {
    try {
      // Suponha que você tenha um endpoint para buscar especialidades
      const response = await api.get<{ id: number; nome: string }[]>(
        '/api/externalWithAuth/candidato/especialidades'
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

    const payload = {
      ...data,
      especialidadeId: Number(data.especialidadeId),
    };

    setLoading(true);

    try {
      const response = await api.post(
        '/api/externalWithAuth/candidato',
        payload
      );
      if (response.status >= 200 && response.status < 300) {
        const isEdit = !!initialValues?.id;
        setSuccessMessage(
          isEdit
            ? 'Profissional editado com sucesso!'
            : 'Profissional cadastrado com sucesso!'
        );
        setShowSuccessModal(true);
        onSuccess?.(response.data);
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
      <form onSubmit={handleSubmit(submitHandler as any)} className="space-y-2">
        <h3 className="text-md font-bold">Dados do Profissional</h3>
        <PessoaForm namePrefix="pessoa" />

        <div className="flex gap-2">
          <FormInput
            name="email"
            label="Email"
            placeholder="exemplo@gmail.com"
            inputProps={{ classNameContainer: 'flex-1/2', type: 'email' }}
          />
          <FormInput
            name="celular"
            label="Celular"
            placeholder="(00) 0 0000-0000"
            inputProps={{ classNameContainer: 'flex-1/2' }}
          />
        </div>

        <h3>Endereço</h3>
        <LocalizacaoForm namePrefix="pessoa.localizacoes[0]" />

        {/* <Card title="Formações Acadêmicas">
          <FormacaoForm namePrefix="" />
        </Card> */}

        <h3 className="text-md font-bold">Dados Cadidato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect name="areaCandidato" placeholder="Área de atuação">
            <>
              {AreaCandidatoEnum.options.map(area => (
                <option key={area} value={area}>
                  {area.replaceAll('_', ' ')}
                </option>
              ))}
            </>
          </FormSelect>

          {areaCandidato === AreaCandidatoEnum.enum.MEDICINA && (
            <FormSelect
              selectProps={{ disabled: !areaCandidato }}
              name="especialidadeId"
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
          )}

          {areaCandidato === AreaCandidatoEnum.enum.MEDICINA && (
            <FormInput
              name="crm"
              placeholder="CRM"
              inputProps={{ disabled: !areaCandidato }}
            />
          )}

          {areaCandidato === AreaCandidatoEnum.enum.ENFERMAGEM && (
            <FormInput
              name="corem"
              placeholder="COREM"
              inputProps={{ disabled: !areaCandidato }}
            />
          )}

          {areaCandidato === AreaCandidatoEnum.enum.MEDICINA &&
            especialidadeId && (
              <FormInput
                name="rqe"
                placeholder="RQE"
                inputProps={{ disabled: !areaCandidato }}
              />
            )}
        </div>

        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Profissional'}
          </PrimaryButton>
        </div>
      </form>

      <ModalSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </FormProvider>
  );
};

export default CandidatoForm;
