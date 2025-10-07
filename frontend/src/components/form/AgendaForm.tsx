import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import Card from '@/components/Card';
import { FormInput } from '@/components/input/FormInput';
import { FormSelect } from '@/components/input/FormSelect';
import ModalSuccess from '@/components/modal/ModalSuccess';

import { PrimaryButton } from '@/components/button/PrimaryButton';
import LocalizacaoForm from '@/components/form/LocalizacaoForm';
import { AgendaInput, agendaSchema } from '@/schemas/agenda.schema';
// import { ConnectGoogleButton } from '../button/GoogleAuth';

import api from '@/axios';
import postCalendar from '@/axios/postCalendar';
import Table, { TableColumn } from '@/components/Table';
import { ConnectGoogleButton } from '../button/GoogleAuth';
import { ErrorMessage } from '../input/ErrorMessage';

type Convidado = {
  email: string;
};

export default function ConvidadosTable() {
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [email, setEmail] = useState<string>('');
  const [nome, setNome] = useState<string>('');

  const { setValue, getValues } = useFormContext();

  const handleRemove = (index: number) => {
    setConvidados(prev => {
      const novosConvidados = prev.filter((_, i) => i !== index);
      setValue(
        'convidados',
        novosConvidados.map(c => c.email)
      );
      return novosConvidados;
    });
  };

  const handleAddConvidado = () => {
    if (!email) return; // validação mínima

    const isConvidado = convidados.find(convidado => convidado.email === email);
    if (!!isConvidado) return;

    const novosConvidados = [...convidados, { email }];
    setConvidados(novosConvidados);

    // Atualiza o array de emails no react-hook-form
    setValue(
      'convidados',
      novosConvidados.map(c => c.email)
    );
    setEmail('');
    setNome('');
  };

  const columns: TableColumn<Convidado>[] = [
    {
      key: 'email',
      label: 'Email do Convidado',
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (_: any, index: number) => (
        <PrimaryButton
          onClick={() => handleRemove(index)}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Remover
        </PrimaryButton>
      ),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end mb-4">
        <FormInput label="Nome do Convidado (opcional)" name="" value={nome} />
        <FormInput
          label="Email do Convidado"
          name=""
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          placeholder="email@exemplo.com"
        />
        <PrimaryButton
          type="button"
          onClick={handleAddConvidado}
          style={{ maxWidth: '50px' }}
        >
          +
        </PrimaryButton>
      </div>
      <Table
        columns={columns}
        data={convidados}
        emptyMessage="Nenhum convidado adicionado."
      />
    </>
  );
}

type AgendaFormProps = {
  onSuccess: (msg: boolean) => void;
  agendaData?: Partial<AgendaInput>;
};

export const AgendaForm = ({ onSuccess, agendaData }: AgendaFormProps) => {
  const [selectLocalizacao, setSelectLocalizacao] = useState<string>('REMOTO');
  const [isEtapa, setIsEtapa] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  // const { data: session } = useSession();
  const MIN_LEAD_MS = 60 * 1000;

  const methods = useForm<AgendaInput>({
    resolver: zodResolver(agendaSchema),
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    console.log('Erros do formulário:', errors);
  }, [errors]);

  const data = watch('data');
  const hora = watch('hora');

  useEffect(() => {
    if (data && hora) {
      console.log('Data recebida:', data); // Debug
      console.log('Hora recebida:', hora); // Debug

      const dataStr = data.toString();
      const horaStr = hora.toString();

      // Verifica se a data está no formato DD/MM/YYYY
      const match = dataStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

      if (match && horaStr.match(/^([01]\d|2[0-3]):[0-5]\d$/)) {
        const [_, dia, mes, ano] = match;

        // Formato ISO 8601: YYYY-MM-DDTHH:mm:ss
        const dataHora = `${ano}-${mes}-${dia}T${horaStr}:00`;

        // console.log('DataHora formatada:', dataHora); // Debug
        setValue('dataHora', dataHora, { shouldValidate: true });
      } else {
        console.error('Formato inválido - Data:', dataStr, 'Hora:', horaStr);
      }
    }
  }, [data, hora, setValue]);

  async function onSubmit(data: AgendaInput) {
    const validationData: any = { ...data };
    const result = agendaSchema.safeParse(validationData);

    // const dt = parseDateTime(data.data, data.hora);

    // if (!dt) {
    //   setError('data', { type: 'manual', message: 'Data ou hora inválida.' });
    //   setError('hora', { type: 'manual', message: 'Data ou hora inválida.' });
    //   return;
    // }

    // const now = Date.now();
    // if (dt.getTime() < now + MIN_LEAD_MS) {
    //   setError('data', {
    //     type: 'manual',
    //     message: 'A data/hora deve ser no mínimo 1 minuto à frente.',
    //   });
    //   setError('hora', {
    //     type: 'manual',
    //     message: 'A data/hora deve ser no mínimo 1 minuto à frente.',
    //   });
    //   return;
    // }

    // const dataHoraISO = dt.toISOString();

    // console.log(dataHoraISO);

    if (!result.success) {
      // console.log('Erros de validação:', result.error.format);
      throw new Error(result.error.format.toString());
    }

    // return;

    try {
      const isEdit = !!agendaData;

      // Remove campos auxiliares antes de enviar
      const { data: d, hora: h, ...rest } = result.data as any;

      let payload = { ...rest, selectLocalizacao };

      const googleCalendar = await postCalendar(payload);

      // console.log(googleCalendar);

      payload = { ...rest, link: googleCalendar.meetLink };

      // console.log('Payload final:', payload);

      // 1. Salva no backend
      await api.post('/api/externalWithAuth/agenda', payload);

      setSuccessMessage(
        isEdit
          ? 'Agenda editada com sucesso!'
          : 'Agenda criada e sincronizada com Google!'
      );
      setShowSuccessModal(true);
      onSuccess(true);
    } catch (error) {
      console.log('Erro ao salvar:', error);
      onSuccess(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto bg-white rounded-lg space-y-3"
      >
        <ConnectGoogleButton />

        <FormInput name="titulo" label="Titulo" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input type="hidden" {...register('dataHora' as any)} />

          <div className="flex gap-2 col-span-2 relative">
            <FormInput
              name={'data' as any}
              label="Data da agenda"
              placeholder="DD-MM-YYYY"
              maskProps={{ mask: '00/00/0000' }}
              errors={undefined}
            />

            <FormInput
              name={'hora' as any}
              label="Hora da agenda"
              type="text"
              placeholder="HH:mm"
              maskProps={{ mask: '00:00' }}
            />

            <ErrorMessage
              top="70px"
              message={
                !errors.data && !errors.hora && errors.dataHora?.message
                  ? errors.dataHora?.message
                  : null
              }
            ></ErrorMessage>
          </div>

          <FormSelect name="tipoEvento" label="Evento da agenda">
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

          <FormSelect
            name="selectLocalizacao"
            label="Tipo de reunião"
            onChange={e => {
              setSelectLocalizacao(e.target.value);
            }}
          >
            <>
              <option value="REMOTO">Remoto</option>
              <option value="PRESENCIAL">Presencial</option>
            </>
          </FormSelect>
        </div>

        {
          selectLocalizacao === 'PRESENCIAL' && (
            <LocalizacaoForm namePrefix="localizacao" />
          )
          // : (
          //   <FormInput name="link" register={register} label="Link da Reunião" />
          // )
        }

        <Card title="Convidados">
          <ConvidadosTable />
        </Card>

        {/* <PrimaryButton
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
        </PrimaryButton> */}

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

        <PrimaryButton
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
        >
          {agendaData ? 'Salvar Alterações' : 'Cadastrar Agenda'}
        </PrimaryButton>
      </form>

      <ModalSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </FormProvider>
  );
};
