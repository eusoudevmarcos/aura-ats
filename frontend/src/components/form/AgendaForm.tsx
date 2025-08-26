import api from '@/axios';
import { useSafeForm } from '@/hook/useSafeForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import Card from '@/components/card';
import { FormInput } from '@/components/input/FormInput';
import { FormSelect } from '@/components/input/FormSelect';

import { PrimaryButton } from '@/components/button/PrimaryButton';
import LocalizacaoForm from '@/components/form/LocalizacaoForm';
import { AgendaInput, agendaSchema } from '@/schemas/agenda.schema';

type AgendaFormProps = {
  onSuccess: (msg: boolean) => void;
  agendaData?: Partial<AgendaInput>;
};

export const AgendaForm = ({ onSuccess, agendaData }: AgendaFormProps) => {
  const [selectLocalizacao, setSelectLocalizacao] = useState<string | null>(
    null
  );
  const [isEtapa, setIsEtapa] = useState<boolean>(false);

  const methods = useSafeForm<AgendaInput>({
    mode: 'independent',
    useFormProps: {
      resolver: zodResolver(agendaSchema),
      mode: 'onTouched',
    },
  });

  const {
    register,
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

  async function onSubmit(data: AgendaInput) {
    const validationData: any = { ...data };
    const result = agendaSchema.safeParse(validationData);

    if (!result.success) return;

    try {
      const isEdit = !!agendaData;
      const url = isEdit ? '/api/external/agenda' : '/api/external/agenda';

      await api.post(url, result.data);
      onSuccess(true);
    } catch (error: any) {
      // console.error('Erro ao criar agenda:', error);
      onSuccess(false);
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
          title="Dados da Agenda"
          classNameContent="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <FormInput
            name="dataHora"
            register={register}
            placeholder="Data e Hora"
            type="datetime-local"
            errors={errors}
            inputProps={{
              pattern: '[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}',
            }}
          />

          <FormSelect
            name="tipoEvento"
            register={register}
            placeholder="Tipo de Evento"
            errors={errors}
            selectProps={{
              children: (
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
              ),
            }}
          />
        </Card>

        <FormSelect
          name="selectLocalizacao"
          onChange={e => {
            setSelectLocalizacao(e.target.value);
          }}
          selectProps={{
            children: (
              <>
                <option value="REMOTO">Remoto</option>
                <option value="PRESENCIAL">Presencial</option>
              </>
            ),
          }}
        ></FormSelect>

        {selectLocalizacao === 'PRESENCIAL' ? (
          <LocalizacaoForm namePrefix="localizacao" />
        ) : (
          <FormInput
            name="link"
            register={register}
            placeholder="Link da Reunião"
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
            <FormInput
              name="etapaAtual.nome"
              register={register}
              placeholder="Nome da Etapa"
              errors={errors}
            />
            <FormInput
              name="etapaAtual.tipo"
              register={register}
              placeholder="Tipo de Etapa"
              errors={errors}
            />
            <FormInput
              name="etapaAtual.ordem"
              register={register}
              placeholder="Ordem"
              type="number"
              errors={errors}
            />
            <FormInput
              name="etapaAtual.descricao"
              register={register}
              placeholder="Descrição"
              errors={errors}
            />
            <FormSelect
              name="etapaAtual.ativa"
              register={register}
              placeholder="Ativa?"
              errors={errors}
              selectProps={{
                children: (
                  <>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </>
                ),
              }}
            />
          </Card>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
        >
          {agendaData ? 'Salvar Alterações' : 'Cadastrar Agenda'}
        </button>
      </form>
    </FormProvider>
  );
};
