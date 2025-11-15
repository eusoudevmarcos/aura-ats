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
import toBase64 from '@/utils/files/toBase64';
import { FormArrayInput } from '../input/FormArrayInput';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';
import FileUploadForm from './FileUploadForm';

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
        emails: initialValues.emails || [],
        contatos: initialValues.contatos || [],
        crm: initialValues.crm || [],
        links: initialValues.links || [],
        especialidadeId: String(initialValues?.especialidadeId),
      }
    : {
        emails: [],
        contatos: [],
        crm: [],
        links: [],
        pessoa: {
          nome: '',
        },
      };

  const methods = useForm<CandidatoInput>({
    resolver: zodResolver(candidatoSchema),
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = methods;

  const contatos = watch('contatos');
  const emails = watch('emails');
  const crm = watch('crm');
  const links = watch('links');

  const handleContatosChange = (newArray: string[]) => {
    setValue('contatos', newArray, { shouldValidate: true });
  };

  const handleEmailsChange = (newArray: string[]) => {
    setValue('emails', newArray, { shouldValidate: true });
  };

  const handleCRMsChange = (newArray: string[]) => {
    setValue('crm', newArray, { shouldValidate: true });
  };

  const handleLinkChange = (newArray: string[]) => {
    setValue('links', newArray, { shouldValidate: true });
  };

  // useEffect(() => {
  // }, [errors]);

  const areaCandidato = watch('areaCandidato');
  const especialidadeId = watch('especialidadeId');

  const fetchEspecialidades = async () => {
    try {
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
      especialidadeId: Number(data.especialidadeId),
      contatos: data.contatos.map(contato => contato),
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
        `Erro ao cadastrar candidato. \n Código do erro:${
          erro?.response?.data?.message ??
          erro.response.data ??
          'Erro ao salvar o candidato'
        } `
      );

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
            addButtonText="+"
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
            addButtonText="+"
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

        <h3>Endereço</h3>

        <LocalizacaoForm namePrefix="pessoa.localizacoes[0]" />

        <div className="border-b border-gray-300 py-2"></div>

        <h3 className="text-md font-bold">Dados Profissionais do Cadidato</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            name="areaCandidato"
            label="Area de Atuação"
            placeholder="Adicione a área de atuação"
          >
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
              label="Especilidade"
              placeholder="Selecione a especialidade"
            >
              <>
                {especialidades ? (
                  especialidades.map(esp => (
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
            </FormSelect>
          )}

          {areaCandidato === AreaCandidatoEnum.enum.ENFERMAGEM && (
            <FormInput
              name="corem"
              label="COREM"
              placeholder="Adicione o COREM"
              inputProps={{ disabled: !areaCandidato }}
            />
          )}

          {areaCandidato === AreaCandidatoEnum.enum.MEDICINA && (
            <>
              <FormArrayInput
                name="crm"
                title="CRMs"
                addButtonText="+"
                ValuesArrayString
                value={crm}
                onChange={handleCRMsChange}
                validateCustom={(value, fieldConfigs, setErrors) => {
                  console.log(value);
                  const cleanCrm = value.trim();
                  const crmRegex = /^\d{1,7}\/[A-Z]{2}$/;
                  if (!crmRegex.test(cleanCrm)) {
                    setErrors(
                      'CRM deve conter apenas números e a sigla do estado (ex: 123456/SP)'
                    );
                    return false;
                  }

                  if (cleanCrm.length > 20) {
                    setErrors('CRM deve ter no máximo 20 caracteres.');
                    return false;
                  }

                  return true;
                }}
                fieldConfigs={[
                  {
                    name: 'crms',
                    placeholder: 'Exemplo: 0000/UF',
                    inputProps: {
                      minLength: 4,
                      classNameContainer: 'w-full',
                    },
                  },
                ]}
                renderChipContent={crms => <span>{crms}</span>}
              />

              {especialidadeId && (
                <FormInput
                  name="rqe"
                  label="RQE"
                  placeholder="Adicione o RQE"
                  inputProps={{ disabled: !areaCandidato }}
                />
              )}
            </>
          )}
        </div>

        <FormArrayInput
          name="links"
          title="Links"
          addButtonText="+"
          ValuesArrayString
          value={links}
          containerClassName="mb-10"
          onChange={handleLinkChange}
          validateCustom={(value, fieldConfigs, setErrors) => {
            const url = value.trim();

            // Expressão regular simples para validar URLs começando com http(s)
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

        <FileUploadForm />

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
