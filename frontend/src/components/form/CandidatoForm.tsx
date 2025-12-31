import api from '@/axios';
import LocalizacaoForm from '@/components/form/LocalizacaoForm';
import PessoaForm from '@/components/form/PessoaForm';
import ModalSuccess from '@/components/modal/ModalSuccess';
import { candidatoSchema, CandidatoType } from '@/schemas/candidato.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';

import { AreaCandidatoEnum } from '@/schemas/candidato.schema';
import toBase64 from '@/utils/files/toBase64';
import { FormArrayInput } from '../input/FormArrayInput';

type CandidatoFormProps = {
  formContexto?: UseFormReturn<CandidatoType>;
  onSubmit?: (data: CandidatoType) => void;
  onSuccess?: (data: any) => void;
  initialValues?: Partial<CandidatoType>;
  disableSuccessModal?: boolean;
};

const CandidatoForm: React.FC<CandidatoFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
  disableSuccessModal,
}) => {
  const [loading, setLoading] = useState(false);
  // const [especialidadesFetch, setEspecialidadesFetch] = useState<
  //   { id: number; nome: string }[]
  // >([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const defaultValues = !!initialValues
    ? {
        ...initialValues,
        emails: initialValues.emails || [],
        contatos: initialValues.contatos || [],
        links: initialValues.links || [],
        medico: initialValues.medico
          ? {
              ...initialValues.medico,
              quadroSocietario:
                initialValues.medico.quadroSocietario == 'true'
                  ? 'true'
                  : 'false', // converte boolean para string na edição
              crm:
                initialValues.medico?.crm?.map(crm => ({
                  ...crm,
                  numero: String(crm.numero),
                })) || [],
              especialidades:
                initialValues.medico?.especialidades?.map(especilidade => ({
                  ...especilidade,
                  especialidadeId: String(especilidade.especialidadeId),
                })) || [],
            }
          : {
              crm: [],
            },
      }
    : {
        emails: [],
        contatos: [],
        links: [],
        pessoa: {
          nome: '',
        },
      };

  const methods = useForm<CandidatoType>({
    resolver: zodResolver(candidatoSchema),
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    unregister,
  } = methods;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const contatos = watch('contatos');
  const emails = watch('emails');
  const links = watch('links');
  const areaCandidato = watch('areaCandidato');

  useEffect(() => {
    if (areaCandidato !== AreaCandidatoEnum.enum.MEDICINA) {
      unregister('medico');
    }
  }, [areaCandidato]);

  const handleContatosChange = (newArray: string[]) => {
    setValue('contatos', newArray, { shouldValidate: true });
  };

  const handleEmailsChange = (newArray: string[]) => {
    setValue('emails', newArray, { shouldValidate: true });
  };

  const handleLinkChange = (newArray: string[]) => {
    setValue('links', newArray, { shouldValidate: true });
  };

  const submitHandler = async (data: CandidatoType) => {
    if (onSubmit) onSubmit(data);

    if (data.anexos && data.anexos.length > 0) {
      const filesBase64 = await Promise.all(
        data.anexos.map(async ({ anexo, ...rest }) => {
          const obj = {
            anexo: {
              nomeArquivo: anexo.nomeArquivo,
              tipo: anexo.tipo,
              mimetype: anexo.mimetype,
              tamanhoKb: anexo.tamanhoKb,
              buffer: '',
            },
            ...rest,
          };

          if (anexo.fileObj) {
            obj.anexo.buffer = await toBase64(anexo.fileObj);
          }
          return obj;
        })
      );
      data.anexos = filesBase64;
    }

    const payload = {
      ...data,
      contatos: data.contatos.map((contato: any) => contato),
    };

    if (payload.medico?.especialidades) {
      payload.medico.especialidades = payload.medico.especialidades.map(
        (_: any) => ({
          especialidade: {
            id: _.especialidade.id,
            nome: _.especialidade.nome,
            sigla: _.especialidade.sigla,
          },
          id: _.id,
          rqe: _.rqe ?? null,
        })
      );
    }

    }

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
        if (!disableSuccessModal) {
          setShowSuccessModal(true);
        }
        onSuccess?.(response.data);
      }
    } catch (erro: any) {
      setTimeout(() => {
        const erroElem = document.getElementById('erro');
        if (erroElem) {
          erroElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler as any)} className="space-y-2">
        <PessoaForm namePrefix="pessoa" isYear />

        <div className="border-b border-gray-300"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormArrayInput
            name="emails"
            title="E-mails"
            ValuesArrayString
            value={emails}
            onChange={handleEmailsChange}
            fieldConfigs={[
              {
                name: 'email',
                type: 'email',
                placeholder: 'Adicione o e-mail',
                inputProps: { minLength: 8, classNameContainer: 'w-full' },
              },
            ]}
            renderChipContent={emails => <span>{emails}</span>}
          />

          <FormArrayInput
            name="contatos"
            title="Contatos"
            ValuesArrayString
            value={contatos}
            onChange={handleContatosChange}
            fieldConfigs={[
              {
                name: 'contato',
                type: 'text',
                placeholder: 'Adicione o contato',
                maskProps: { mask: '(00) 000000000' },
                inputProps: { minLength: 8, classNameContainer: 'w-full' },
              },
            ]}
            renderChipContent={contato => <span>{contato}</span>}
          />
        </div>

        <div className="border-b border-gray-300 py-2"></div>

        <h3 className="font-bold text-primary">Endereço</h3>

        <LocalizacaoForm namePrefix="pessoa.localizacoes[0]" />

        <div className="border-b border-gray-300 py-2"></div>

        <h3 className="font-bold  text-primary">Dados do Profissional</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            name="areaCandidato"
            label="Area de Atuação"
            placeholder="Adicione a área de atuação"
            selectProps={{
              classNameContainer: 'col-span-full',
            }}
          >
            <>
              {AreaCandidatoEnum.options.map(area => (
                <option key={area} value={area}>
                  {area.replaceAll('_', ' ')}
                </option>
              ))}
            </>
          </FormSelect>

          {areaCandidato === AreaCandidatoEnum.enum.ENFERMAGEM && (
            <FormInput
              name="corem"
              label="COREM"
              placeholder="Adicione o COREM"
              inputProps={{ disabled: !areaCandidato }}
            />
          )}

          {areaCandidato === AreaCandidatoEnum.enum.MEDICINA && <MedicoForm />}
        </div>

        <FormArrayInput
          name="links"
          title="Links"
          ValuesArrayString
          value={links}
          onChange={handleLinkChange}
          validateCustom={(value, fieldConfigs, setErrors) => {
            const url = value.trim();

            const urlRegex =
              /^(https?:\/\/)(([\w-]+\.)+[\w-]{2,})(:[0-9]{1,5})?(\/.*)?$/i;
            if (!urlRegex.test(url)) {
              setErrors(
                'Por favor, insira um link válido (ex: https://meusite.com)'
              );
              return false;
            }

            if (url.length > 2048) {
              setErrors('O link deve ter no máximo 2048 caracteres.');
              return false;
            }
            return true;
          }}
          fieldConfigs={[
            {
              name: 'links',
              placeholder: 'Adicione o link',
              inputProps: {
                minLength: 4,
                classNameContainer: 'w-full',
              },
            },
          ]}
          renderChipContent={link => <span>{link}</span>}
        />

        <div className="border-b border-gray-300 py-2"></div>

        <FileUploadForm />

        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Profissional'}
          </PrimaryButton>
        </div>
      </form>

      {!disableSuccessModal && (
        <ModalSuccess
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
          }}
          message={successMessage}
        />
      )}
    </FormProvider>
  );
};

export default CandidatoForm;
