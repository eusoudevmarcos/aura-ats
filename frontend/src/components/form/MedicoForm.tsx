import { useFormContext } from 'react-hook-form';
import { FormArrayInput } from '../input/FormArrayInput';
import { FormInput } from '../input/FormInput';
import { FormTextarea } from '../input/FormTextarea';

type MedicoFormProps = {
  namePrefix?: string;
};

function makeMedicoName(field: string, namePrefix = 'medico') {
  return `${namePrefix}.${field}`;
}

const MedicoForm = ({ namePrefix = 'medico' }: MedicoFormProps) => {
  const rqeName = makeMedicoName('rqe', namePrefix);
  const crmName = makeMedicoName('crm', namePrefix);
  const quadroSocietarioName = makeMedicoName('quadroSocietario', namePrefix);
  const quadroDeObservacoesName = makeMedicoName(
    'quadroDeObservações',
    namePrefix
  );
  const examesName = makeMedicoName('exames', namePrefix);
  const especialidadesEnfermidadesName = makeMedicoName(
    'especialidadesEnfermidades',
    namePrefix
  );
  const porcentagemRepasseMedicoName = makeMedicoName(
    'porcentagemRepasseMedico',
    namePrefix
  );
  const porcentagemConsultasName = makeMedicoName(
    'porcentagemConsultas',
    namePrefix
  );
  const porcentagemExamesName = makeMedicoName('porcentagemExames', namePrefix);

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const especialidadeId = watch('especialidadeId');
  const areaCandidato = watch('areaCandidato');

  // O valor selecionado para manter checked na interface de radio
  const quadroSocietarioValue = watch(quadroSocietarioName);
  const crm = watch(crmName);

  const handleCRMsChange = (newArray: any[]) => {
    console.log(newArray);
    setValue(crmName, newArray, { shouldValidate: true });
  };
  return (
    <>
      {especialidadeId && (
        <FormInput
          name={rqeName}
          label="RQE"
          placeholder="Adicione o RQE"
          inputProps={{ disabled: !areaCandidato }}
        />
      )}
      <FormArrayInput
        name={crmName}
        title="CRMs"
        addButtonText="+"
        value={crm}
        onChange={handleCRMsChange}
        containerClassName="col-span-full"
        validateCustom={(value, fieldConfigs, setErrors) => {
          const cleanCrm = value.trim();
          if (cleanCrm.length > 20) {
            setErrors('CRM deve ter no máximo 20 caracteres.');
            return false;
          }

          return true;
        }}
        fieldConfigs={[
          {
            name: 'numero',
            placeholder: 'Exemplo: 0000',
            inputProps: {
              minLength: 4,
              classNameContainer: 'w-full',
            },
          },
          {
            name: 'ufCrm',
            placeholder: 'UF',
            inputProps: {
              minLength: 4,
              classNameContainer: 'w-full',
            },
          },
          {
            name: 'dataInscricao',
            placeholder: 'data de inscrição',
            maskProps: { mask: '00/00/0000' },
            inputProps: {
              minLength: 4,
              classNameContainer: 'w-full',
            },
          },
        ]}
        renderChipContent={({ dataInscricao, ufCrm, numero }) => (
          <>
            <span>
              Nº {numero}/{ufCrm}
            </span>
            {', '}
            <span>{dataInscricao}</span>
          </>
        )}
      />
      <section className="grid grid-cols-1 md:grid-cols-3 gap-2 col-span-full">
        <FormInput
          name={porcentagemRepasseMedicoName}
          label="Porcentagem de Repasse Médico"
          inputProps={{ type: 'text', placeholder: '%' }}
        />

        <FormInput
          name={porcentagemConsultasName}
          label="Porcentagem de Consultas"
          inputProps={{ type: 'text', placeholder: '%' }}
        />

        <FormInput
          name={porcentagemExamesName}
          label="Porcentagem de Exames"
          inputProps={{ type: 'text', placeholder: '%' }}
        />

        <FormTextarea
          name={quadroDeObservacoesName}
          label="Quadro de Observações"
          textareaProps={{
            placeholder: 'Observações adicionais',
            classNameContainer: 'col-span-full',
          }}
        />

        <FormTextarea
          name={examesName}
          placeholder="Digite os exames"
          label="Quadro de Exames"
          textareaProps={{ classNameContainer: 'col-span-full' }}
        />

        <FormTextarea
          name={especialidadesEnfermidadesName}
          label="Especialidades/Enfermidades"
          textareaProps={{
            classNameContainer: 'col-span-full',
            placeholder:
              'Adicione as Especialidades e infermidades tratadas pelo médico',
          }}
        />

        <div className="flex items-center gap-4 col-span-full">
          <span className="font-medium text-sm">
            Faz parte de quadro societário?
          </span>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="true"
              {...register(quadroSocietarioName)}
              checked={quadroSocietarioValue === 'true'}
            />
            Sim
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="false"
              {...register(quadroSocietarioName)}
              checked={quadroSocietarioValue === 'false'}
            />
            Não
          </label>
        </div>
      </section>
    </>
  );
};

export default MedicoForm;
