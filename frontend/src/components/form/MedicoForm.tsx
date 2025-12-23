import api from '@/axios';
import { EspecialidadeMedicoInput } from '@/schemas/candidato.schema';
import { UF_MODEL } from '@/utils/UF';
import { useEffect, useState } from 'react';
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
  const [especialidadesFetch, setEspecialidadesFetch] = useState<
    { id: number; nome: string }[]
  >([]);

  const especilidades = makeMedicoName('especilidades', namePrefix);
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

  const fetchEspecialidades = async () => {
    try {
      const response = await api.get<{ id: number; nome: string }[]>(
        '/api/externalWithAuth/candidato/especialidades'
      );
      setEspecialidadesFetch(response.data);
    } catch (error) {
      console.log('Erro ao carregar especialidades:', error);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const quadroSocietarioValue = watch(quadroSocietarioName);
  const especialidades = watch('medico.especialidades');
  const crm = watch(crmName);

  const handleCRMsChange = (newArray: any[]) => {
    setValue(crmName, newArray, { shouldValidate: true });
  };

  const handleEspecilidadeChange = (newArray: EspecialidadeMedicoInput[]) => {
    setValue('medico.especialidades', newArray, { shouldValidate: true });
  };

  return (
    <>
      {especialidadesFetch && (
        <FormArrayInput
          name={especilidades}
          title="Especilidades"
          value={especialidades}
          onChange={handleEspecilidadeChange}
          containerClassName="col-span-full"
          validateCustom={() => {
            return true;
          }}
          fieldConfigs={[
            {
              name: 'rqe',
              label: 'Número RQE do Médico',
              required: true,
              placeholder: 'Adicione o RQE',
              inputProps: {
                minLength: 3,
                classNameContainer: 'w-full',
              },
              type: 'number',
              maskProps: { mask: /^\d*$/ },
            },
            {
              component: 'select',
              label: 'Especilidade do Médico',
              required: true,
              name: 'especialidadeId',
              placeholder: 'Adicione a Especilidade',
              selectOptions: (
                <>
                  {especialidadesFetch ? (
                    especialidadesFetch.map(esp => (
                      <option key={esp.id} value={esp.id}>
                        {esp.nome}
                      </option>
                    ))
                  ) : (
                    <option key={null} className="text-red-500">
                      Não foi possivel buscar especialidades
                    </option>
                  )}
                </>
              ),
            },
          ]}
          renderChipContent={especialidade => {
            const nomeEspecialidade =
              especialidadesFetch[especialidade.especialidadeId - 1]?.nome ??
              '';

            return (
              <span>
                {nomeEspecialidade} - RQE {especialidade.rqe}
              </span>
            );
          }}
        />
      )}
      <div className="border-b border-gray-300 col-span-full"></div>
      <FormArrayInput
        name={crmName}
        title="CRM´s"
        value={crm}
        onChange={handleCRMsChange}
        containerClassName="col-span-full"
        fieldConfigs={[
          {
            name: 'numero',
            label: 'Número CRM do Médico',
            required: true,
            placeholder: 'Exemplo: 0000',
            inputProps: {
              minLength: 4,
              classNameContainer: 'w-full',
            },
          },
          {
            component: 'select',
            name: 'ufCrm',
            label: 'UF',
            required: true,
            placeholder: 'Selecione a UF',
            selectOptions: UF_MODEL,
          },
          {
            name: 'dataInscricao',
            label: 'Data de Inscrição',
            placeholder: '00/00/0000',
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
      <div className="border-b border-gray-300 col-span-full"></div>
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

        <div className="border-b border-gray-300 col-span-full my-2"></div>

        <FormTextarea
          name={quadroDeObservacoesName}
          label="Quadro de Observações"
          textareaProps={{
            placeholder: 'Observações adicionais',
            classNameContainer: 'md:col-span-1 col-span-full',
          }}
        />

        <FormTextarea
          name={examesName}
          placeholder="Digite os exames"
          label="Quadro de Exames"
          textareaProps={{ classNameContainer: 'md:col-span-1 col-span-full' }}
        />

        <FormTextarea
          name={especialidadesEnfermidadesName}
          label="Especialidades/Enfermidades"
          textareaProps={{
            classNameContainer: 'md:col-span-1 col-span-full',
            placeholder:
              'Adicione as Especialidades e infermidades tratadas pelo médico',
          }}
        />

        <div className="border-b border-gray-300 col-span-full"></div>

        <div className="flex items-center gap-6 col-span-full">
          <span className="font-medium text-sm">
            Faz parte de quadro societário?
          </span>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="true"
              {...register(quadroSocietarioName)}
              checked={quadroSocietarioValue === 'true'}
              onClick={e => {
                if (quadroSocietarioValue === 'true') {
                  // Limpa a seleção se clicar novamente
                  e.preventDefault(); // impede que o radio marque
                  // Limpa no react-hook-form
                  if (typeof setValue === 'function')
                    setValue(quadroSocietarioName, '');
                }
              }}
            />
            Sim
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="false"
              {...register(quadroSocietarioName)}
              checked={quadroSocietarioValue === 'false'}
              onClick={e => {
                if (quadroSocietarioValue === 'false') {
                  e.preventDefault();
                  if (typeof setValue === 'function')
                    setValue(quadroSocietarioName, '');
                }
              }}
            />
            Não
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value=""
              {...register(quadroSocietarioName)}
              checked={quadroSocietarioValue === ''}
              onClick={e => {
                if (quadroSocietarioValue === '') {
                  e.preventDefault();
                  // Already unset, don't do anything
                } else {
                  if (typeof setValue === 'function')
                    setValue(quadroSocietarioName, '');
                }
              }}
            />
            Não sei
          </label>
        </div>
      </section>
      <div className="border-b border-gray-300 col-span-full"></div>
    </>
  );
};

export default MedicoForm;
