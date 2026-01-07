import api from '@/axios';
import { SearchIcon, WhatsAppIcon } from '@/components/icons';
import { DataCard } from '@/components/takeit/DataCard';
import { Info } from '@/components/takeit/Info';
import { convertDataStoneToCandidatoDTO } from '@/dto/dataStoneCandidato.dto';
import { handleZeroLeft } from '@/utils/helper/helperCPF';
import { mask } from '@/utils/mask/mask';
import { unmask } from '@/utils/mask/unmask';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Dynamic imports para componentes pesados
const CandidatoForm = dynamic(
  () => import('@/components/form/CandidatoForm'),
  {
    loading: () => (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-primary">Carregando formulário...</span>
      </div>
    ),
    ssr: false,
  }
);

const Modal = dynamic(
  () => import('@/components/modal/Modal'),
  {
    ssr: false,
  }
);

export default function ViewPersonPage(): React.ReactElement {
  const router = useRouter();
  const { cpf } = router.query;

  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [candidatoId, setCandidatoId] = useState(null);
  const [cache, setCache] = useState(false);

  // Função para buscar dados da pessoa pelo CPF
  const fetchPersonData = useCallback(async (cpf: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    if (!cpf) {
      setError('CPF não informado.');
      setLoading(false);
      return;
    }

    const cpfUnmask = unmask(cpf as string);

    try {
      const params = {
        typeData: 'CPF',
        query: cpfUnmask,
        tipo: 'persons',
        isDetail: true,
      };

      const response = await api.get('/api/externalWithAuth/take-it/search', {
        params,
      });

      const rawData = Array.isArray(response.data?.data)
        ? response.data.data[0]
        : response.data?.data;

      setIsSave(response.data.isSave);
      if (response?.data?.candidato?.id) {
        setCandidatoId(response.data.candidato.id);
      }
      if (response?.data?.cache) {
        setCache(response.data.cache);
      }

      if (!rawData) {
        setError('Pessoa não encontrada.');
        setData(null);
      } else {
        setData(rawData);
      }
    } catch (erro: any) {
      setError(
        erro?.response?.data?.details?.mensagem ||
          erro?.response?.data?.error ||
          'Erro ao buscar dados.'
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cpf) {
      fetchPersonData(cpf as string);
    }
  }, [cpf, fetchPersonData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showExportDropdown &&
        !(event.target as HTMLElement).closest('#export-dropdown') &&
        !(event.target as HTMLElement).closest('#export-btn')
      ) {
        setShowExportDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportDropdown]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[300px] text-neutral-500">
        Carregando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center min-h-[200px] text-red-500 font-bold">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex justify-center items-center min-h-[200px] text-neutral-400">
        Nenhum dado disponível para exibir.
      </div>
    );
  }

  // Conversão de dados memoizada
  const convertedData = useMemo(
    () => convertDataStoneToCandidatoDTO(data),
    [data]
  );

  return (
    <div className="px-4 py-2 mb-30">
      <div className="flex flex-wrap gap-2 justify-between">
        <button onClick={() => router.back()} className="buttonPrimary">
          Voltar
        </button>
        <div id="export-dropdown" className="relative flex gap-2">
          <button
            id="salvar-candidato-btn"
            className={`h-9 px-4 disabled:opacity-50 ${
              candidatoId && isSave ? 'buttonPrimary-outlined' : 'buttonPrimary'
            } flex items-center`}
            onClick={async () => {
              if (candidatoId && isSave) {
                await router.push(`/candidato/${candidatoId}`);
                return;
              }
              setShowModalEdit(prev => !prev);
            }}
            type="button"
            disabled={isSave && !candidatoId}
          >
            {candidatoId && isSave
              ? 'Ver Profissional'
              : isSave && !candidatoId
              ? 'Representante de empresa'
              : 'Salvar como Profissional'}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center mb-1 gap-2">
        <span className="rounded bg-primary/10 font-medium text-primary py-1 text-sm select-none ">
          {cache ? 'Cache: SIM' : 'Cache: NÃO'}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-x-6 gap-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Nome: <span className="text-neutral-900 font-black">{data.name}</span>
        </h1>
      </div>

      <div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-2"
        id="card"
        ref={cardRef}
      >
        {/* Dados Pessoais */}
        <DataCard
          title="Dados do Profissional"
          className="col-span-2"
        >
          <div className="grid gap-1 sm:grid-cols-2">
            <Info label="CPF" value={mask(handleZeroLeft(data.cpf))} />
            <Info label="RG" value={data.rg} />
            <Info
              label="Sexo"
              value={
                data.gender === 'F'
                  ? 'Feminino'
                  : data.gender === 'M'
                  ? 'Masculino'
                  : 'N/A'
              }
            />
            <Info
              label="Data de Nascimento"
              value={
                data.birthday && typeof data.birthday === 'string'
                  ? (() => {
                      const [year, month, day] = data.birthday.split('-');
                      if (year && month && day) {
                        return `${day.padStart(2, '0')}/${month.padStart(
                          2,
                          '0'
                        )}/${year}`;
                      }
                      return data.birthday;
                    })()
                  : 'N/A'
              }
            />
            <Info label="Idade" value={data.age} />
            <Info label="Nome da Mãe" value={data.mother_name} />
            <Info
              label="Falecido"
              value={
                data.possibly_dead === null || data.possibly_dead === undefined
                  ? 'N/A'
                  : data.possibly_dead
                  ? 'Sim'
                  : 'Não'
              }
            />
            <Info
              label="Aposentado"
              value={
                data.retired === null || data.retired === undefined
                  ? 'N/A'
                  : data.retired
                  ? 'Sim'
                  : 'Não'
              }
            />
            <Info
              label="Bolsa Família"
              value={
                data.bolsa_familia === null || data.bolsa_familia === undefined
                  ? 'N/A'
                  : data.bolsa_familia
                  ? 'Sim'
                  : 'Não'
              }
            />
            <Info label="Signo" value={data.sign || '-'} />
          </div>
        </DataCard>

        {/* Telefones Celulares */}
        <DataCard title="Telefones Celulares">
          {data.mobile_phones && data.mobile_phones.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.mobile_phones.map((phone: any, idx: any) => (
                <div
                  key={idx}
                  className="border border-neutral-200 bg-neutral-50 p-3 rounded-xl w-fit"
                >
                  <Info
                    label={
                      <span className="flex items-center gap-2">
                        <Link
                          href={
                            phone.number
                              ? `https://wa.me/${phone.ddd + phone.number}`
                              : ''
                          }
                          target="_blank"
                          className="ml-2 bg-emerald-600 rounded-md p-1"
                        >
                          <WhatsAppIcon color="white" />
                        </Link>
                      </span>
                    }
                    value={`(${phone.ddd})${phone.number} - ${
                      phone.whatsapp_datetime ?? 'Sem Data'
                    }`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 p-2">
              Nenhum celular cadastrado.
            </div>
          )}
        </DataCard>

        {/* Telefones Fixos */}
        <DataCard title="Telefones Fixos">
          {data.land_lines && data.land_lines.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.land_lines.map((phone: any, idx: any) => (
                <div
                  key={idx}
                  className="border border-neutral-200 bg-neutral-50 p-3 rounded-xl w-fit"
                >
                  <Info value={`(${phone.ddd})${phone.number}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 p-2">
              Nenhum telefone fixo cadastrado.
            </div>
          )}
        </DataCard>

        {/* E-mails */}
        <DataCard title="E-mails">
          {data.emails && data.emails.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.emails.map((email: any, idx: any) => (
                <div
                  key={idx}
                  className="border border-neutral-200 bg-neutral-50 p-3 rounded-xl"
                >
                  <Info value={email.email} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 p-2">
              Nenhum e-mail cadastrado.
            </div>
          )}
        </DataCard>

        {/* Profissão e Renda */}
        <DataCard title="Profissão e Renda">
          <div className="flex flex-col">
            <Info
              label="CBO"
              value={`${data.cbo_code ? data.cbo_code : ''}${
                data.cbo_code && data.cbo_description ? ' - ' : ''
              }${data.cbo_description ? data.cbo_description : ''}`}
            />
            <Info label="Renda Estimada" value={data.estimated_income} />
          </div>
        </DataCard>

        {/* Empresas Relacionadas */}
        <DataCard title="Empresas Relacionadas">
          {data.related_companies && data.related_companies.length > 0 ? (
            <div className="flex flex-col gap-2">
              {data.related_companies.map((company: any, idx: any) => (
                <div
                  key={idx}
                  className="border border-neutral-200 bg-neutral-50 p-3 rounded-xl"
                >
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <Info
                        label="CNPJ"
                        value={mask(handleZeroLeft(company.cnpj))}
                      />
                      <Link
                        href={`/take-it/view-company/${handleZeroLeft(
                          company.cnpj
                        )}`}
                        className="ml-1 bg-primary rounded p-0.5 inline-flex"
                        title="Visualizar empresa"
                      >
                        <SearchIcon color="white" style={{ padding: '2px' }} />
                      </Link>
                    </div>
                    <Info label="Razão Social" value={company.company_name} />
                    <Info label="Nome Fantasia" value={company.trading_name} />
                    <Info
                      label="Situação Cadastral"
                      value={company.registry_situation}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 p-2">
              Nenhuma empresa relacionada cadastrada.
            </div>
          )}
        </DataCard>

        {/* Endereços */}
        <DataCard title="Endereços">
          {data.addresses && data.addresses.length > 0 ? (
            <div className="flex flex-col gap-2">
              {data.addresses.map((addr: any, idx: any) => (
                <div
                  key={idx}
                  className="border border-neutral-200 bg-neutral-50 p-3 rounded-xl"
                >
                  <div className="flex flex-col-reverse">
                    <Info label="Tipo" value={addr.type} />
                    <Info
                      label="Rua"
                      value={`${addr.street ? `${addr.street}, ` : ''} ${
                        addr.number ? `${addr.number}, ` : ''
                      } ${addr.complement ? `${addr.complement}` : ''}`}
                    />
                    <Info label="Bairro" value={addr.neighborhood} />
                    <Info
                      label="Cidade"
                      value={`${addr.city}${
                        addr.district ? ' , ' + addr.district : ''
                      }`}
                    />
                    <Info label="CEP" value={addr.postal_code} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 p-2">
              Nenhum endereço cadastrado.
            </div>
          )}
        </DataCard>

        {/* Familiares */}
        <DataCard title="Familiares">
          {data.family_datas && data.family_datas.length > 0 ? (
            <div className="flex flex-col gap-2">
              {data.family_datas.map((fam: any, idx: any) => (
                <div
                  key={idx}
                  className="border border-neutral-200 bg-neutral-50 p-3 rounded-xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Info label="Nome" value={fam.name} />
                    <Info label="CPF" value={mask(handleZeroLeft(fam.cpf))} />
                    <Info label="Descrição" value={fam.description} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 p-2">
              Nenhum familiar cadastrado.
            </div>
          )}
        </DataCard>

        {/* PEP */}
        <DataCard title="Pessoa Politicamente Exposta (PEP)">
          <div className="flex flex-col gap-2">
            <Info
              label="PEP"
              value={
                data.pep === null || data.pep === undefined
                  ? 'N/A'
                  : data.pep
                  ? 'Sim'
                  : 'Não'
              }
            />
            {data.pep && <Info label="Tipo de PEP" value={data.pep_type} />}
          </div>
        </DataCard>
      </div>

      <Modal
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        title="Editar Candidato"
      >
        <CandidatoForm
          initialValues={convertedData}
          onSuccess={candidato => {
            setShowModalEdit(prev => !prev);
            setIsSave(true);
            setCache(true);
            setCandidatoId(candidato.id);
          }}
        />
      </Modal>
    </div>
  );
}
