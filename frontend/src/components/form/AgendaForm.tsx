import api from '@/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Card from '@/components/Card';
import { FormInput } from '@/components/input/FormInput';
import { FormSelect } from '@/components/input/FormSelect';
import ModalSuccess from '@/components/modal/ModalSuccess';

import { PrimaryButton } from '@/components/button/PrimaryButton';
import LocalizacaoForm from '@/components/form/LocalizacaoForm';
import { AgendaInput, agendaSchema } from '@/schemas/agenda.schema';
// import { ConnectGoogleButton } from '../button/GoogleAuth';

type AgendaFormProps = {
  onSuccess: (msg: boolean) => void;
  agendaData?: Partial<AgendaInput>;
};

export const AgendaForm = ({ onSuccess, agendaData }: AgendaFormProps) => {
  const [selectLocalizacao, setSelectLocalizacao] = useState<string | null>(
    null
  );
  const [isEtapa, setIsEtapa] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  // const { data: session } = useSession();

  const methods = useForm<AgendaInput>({
    resolver: zodResolver(agendaSchema),
    mode: 'onTouched',
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (agendaData) {
      Object.entries(agendaData).forEach(([key, value]) => {
        if (key === 'localizacao' && value) {
          Object.entries(value as any).forEach(([k, v]) => {
            setValue(`localizacao.${k}` as any, v);
          });
        } else if (key === 'etapaAtual' && value) {
          Object.entries(value as any).forEach(([k, v]) => {
            setValue(`etapaAtual.${k}` as any, v);
          });
        } else {
          setValue(key as keyof AgendaInput, value as any);
        }
      });
    }
  }, [agendaData, setValue]);

  useEffect(() => {
    register('dataHora' as any);
  }, [register]);

  // removido sincronização anterior de dataHora

  // const CreateEventForm = async (event: React.FormEvent) => {
  //   event.preventDefault();

  // if (!session) {
  //   alert('Você precisa estar logado para criar um evento.');
  //   return;
  // }

  //   const eventData: CreateEventRequestBody = {
  //     summary: 'Reunião de Equipe',
  //     description: 'Discutir o progresso do projeto.',
  //     start: '2025-08-27T10:00:00',
  //     end: '2025-08-27T11:00:00',
  //   };

  //   const response = await fetch('/api/create-event', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(eventData),
  //   });

  //   const result = await response.json();

  //   if (response.ok) {
  //     alert(result.message);
  //     console.log('Evento criado:', result.event);
  //   } else {
  //     alert(`Erro: ${result.message}`);
  //   }
  // };

  async function onSubmit(data: AgendaInput) {
    const validationData: any = { ...data };
    console.log('aqui');
    const result = agendaSchema.safeParse(validationData);

    if (!result.success) return;

    try {
      const isEdit = !!agendaData;

      // monta dataHora string final para backend
      const { data: d, hora: h, ...rest } = result.data as any;
      const dataHora = `${d} ${h}:00`;
      const payload = { ...rest, dataHora };

      await api.post('/api/externalWithAuth/agenda', payload);

      setSuccessMessage(
        isEdit
          ? 'Agenda editada com sucesso!'
          : 'Agenda cadastrada com sucesso!'
      );
      setShowSuccessModal(true);

      onSuccess(true);
    } catch (error: any) {
      onSuccess(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto bg-white rounded-lg space-y-6"
      >
        <Card
          title="Dados da Agenda"
          classNameContent="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input type="hidden" {...register('dataHora' as any)} />

          <FormInput
            name={'data' as any}
            label="Data"
            placeholder="DD-MM-YYYY"
            maskProps={{ mask: '00/00/0000' }}
          />

          <FormInput
            name={'hora' as any}
            label="Hora"
            type="text"
            placeholder="HH:mm"
            maskProps={{ mask: '00:00' }}
          />

          <FormSelect name="tipoEvento" label="Tipo de Evento">
            <>
              <option value="TRIAGEM_INICIAL">Triagem Inicial</option>
              <option value="ENTREVISTA_RH">Entrevista RH</option>
              <option value="ENTREVISTA_GESTOR">Entrevista Gestor</option>
              <option value="TESTE_TECNICO">Teste Técnico</option>
              <option value="TESTE_PSICOLOGICO">Teste Psicológico</option>
              <option value="DINAMICA_GRUPO">Dinâmica de Grupo</option>
              <option value="PROPOSTA">Proposta</option>
              <option value="OUTRO">Outro</option>
            </>
          </FormSelect>
        </Card>

        <FormSelect
          name="selectLocalizacao"
          label="Qual preferencia de localização?"
          onChange={e => {
            setSelectLocalizacao(e.target.value);
          }}
        >
          <>
            <option value="REMOTO">Remoto</option>
            <option value="PRESENCIAL">Presencial</option>
          </>
        </FormSelect>

        {selectLocalizacao === 'PRESENCIAL' ? (
          <LocalizacaoForm namePrefix="localizacao" />
        ) : (
          <FormInput
            name="link"
            register={register}
            label="Link da Reunião"
            errors={errors}
          />
        )}

        <PrimaryButton
          onClick={() => {
            setIsEtapa(!isEtapa);
          }}
        >
          Adicionar etapas
          {isEtapa ? (
            <span className="material-icons-outlined">arrow_drop_up</span>
          ) : (
            <span className="material-icons-outlined">arrow_drop_down</span>
          )}
        </PrimaryButton>

        {isEtapa && (
          <Card
            title="Etapa do Processo Seletivo (OPCIONAL)"
            classNameContent="grid grid-cols-1 md:grid-cols-2 gap-4"
            classNameContainer="animate-[slideInDown_0.3s_cubic-bezier(0.4,0,0.2,1)_forwards,fadeIn_0.6s_linear_forwards]"
          >
            <FormInput name="etapaAtual.nome" label="Nome da Etapa" />
            <FormInput name="etapaAtual.tipo" label="Tipo de Etapa" />
            <FormInput name="etapaAtual.ordem" label="Ordem" type="number" />
            <FormInput name="etapaAtual.descricao" label="Descrição" />
            <FormSelect name="etapaAtual.ativa" label="Ativa?">
              <>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </>
            </FormSelect>
          </Card>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
        >
          {agendaData ? 'Salvar Alterações' : 'Cadastrar Agenda'}
        </button>

        {/* <ConnectGoogleButton /> */}
        {/* 
        <button
          onClick={CreateEventForm}
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
        >
          {agendaData ? 'Salvar Alterações' : 'Cadastrar Agenda  no google'}
        </button> */}
      </form>

      <ModalSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </FormProvider>
  );
};
