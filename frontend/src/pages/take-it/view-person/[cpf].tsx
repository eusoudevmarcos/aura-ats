import api from '@/axios';
import CandidatoForm from '@/components/form/CandidatoForm';
import { SearchIcon, WhatsAppIcon } from '@/components/icons';
import Modal from '@/components/modal/Modal';
import Card from '@/components/takeit/Card';
import { convertDataStoneToCandidatoDTO } from '@/dto/dataStoneCandidato.dto';
import { convertDateFromPostgres } from '@/utils/date/convertDateFromPostgres';
import { exportToCSV, exportToPDF, mostrarValor } from '@/utils/exportCSV';
import { unmask } from '@/utils/mask/unmask';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
interface SearchOptions {
  [key: string]: any;
}

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
  const fetchPersonData = async (cpf: string) => {
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

      // Adaptação do backend: pode vir como [{}] ou {}
      const rawData = Array.isArray(response.data?.data)
        ? response.data.data[0]
        : response.data?.data;

      setIsSave(response.data.isSave);
      if (response?.data?.candidato?.id) {
        setCandidatoId(response.data.candidato.id);
      }
      console.log(response?.data?.cache);
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
      console.log(erro);
      setError(
        erro?.response?.data?.details?.mensagem ||
          erro?.response?.data?.error ||
          'Erro ao buscar dados.'
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cpf) {
      fetchPersonData(cpf as string);
    }
  }, [cpf]);

  // Função para exportar
  const handleExport = async (type: 'csv' | 'pdf') => {
    setShowExportDropdown(false);
    if (type === 'csv') {
      exportToCSV(data);
    } else if (type === 'pdf') {
      await exportToPDF(cardRef as React.RefObject<HTMLDivElement>);
    }
  };

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
    return <div className="p-8 text-center text-gray-500">Carregando...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nenhum dado disponível para exibir.
      </div>
    );
  }

  return (
    // <TakeitLayout fit>
    //   {({}) => (
    <div className="px-4 py-2 mb-10">
      <div className="flex justify-between py-2">
        <button
          onClick={() => router.push('/take-it')}
          className="buttonPrimary"
        >
          Voltar
        </button>

        <div className="relative flex gap-2" id="export-dropdown">
          <button
            id="export-btn"
            className="buttonPrimary flex items-center"
            onClick={() => setShowExportDropdown(prev => !prev)}
            type="button"
          >
            Exportar
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button
            id="salvar-candidato-btn"
            className={`${
              candidatoId && isSave ? 'buttonPrimary-outlined' : 'buttonPrimary'
            } flex items-center`}
            onClick={async () => {
              if (candidatoId && isSave) {
                console.log('router');
                await router.push(`/candidato/${candidatoId}`);
                return;
              }
              setShowModalEdit(prev => !prev);
            }}
            type="button"
          >
            {candidatoId && isSave
              ? 'Ver Profissional'
              : 'Salvar como Profissional'}
          </button>
        </div>
      </div>

      <p className="text-primary font-bold">Cache: {cache ? 'SIM' : 'NÂO'}</p>

      <h1 className="text-2xl mb-4 font-black">
        <span className="text-primary">Nome:</span> {mostrarValor(data.name)}
      </h1>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
        id="card"
        ref={cardRef}
      >
        {/* Dados Pessoais */}
        <Card title="Dados Pessoais" className={'md:col-start-1 md:col-end-3'}>
          <div className="grid grid-cols-1 md:grid-cols-4 space-y-4 space-x-3">
            <p className="font-medium">
              <strong className="text-primary">CPF:</strong>{' '}
              {mostrarValor(data.cpf)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">RG:</strong>{' '}
              {mostrarValor(data.rg)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Sexo:</strong>
              {data.gender === 'F'
                ? 'Feminino'
                : data.gender === 'M'
                ? 'Masculino'
                : 'N/A'}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Data de Nascimento:</strong>
              {data.birthday && typeof data.birthday === 'string'
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
                : 'N/A'}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Idade:</strong>{' '}
              {mostrarValor(data.age)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Nome da Mãe:</strong>{' '}
              {mostrarValor(data.mother_name)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Falecido:</strong>
              {data.possibly_dead === null || data.possibly_dead === undefined
                ? 'N/A'
                : data.possibly_dead
                ? 'Sim'
                : 'Não'}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Aposentado:</strong>
              {data.retired === null || data.retired === undefined
                ? 'N/A'
                : data.retired
                ? 'Sim'
                : 'Não'}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Bolsa Família:</strong>
              {data.bolsa_familia === null || data.bolsa_familia === undefined
                ? 'N/A'
                : data.bolsa_familia
                ? 'Sim'
                : 'Não'}
            </p>

            <p className="font-medium">
              <strong className="text-primary">Signo:</strong>
              {data.sign || '-'}
            </p>
          </div>
        </Card>
        {/* Profissão e Renda */}
        <Card title="Profissão e Renda">
          <div className="flex flex-wrap space-y-4 space-x-9">
            <p className="font-medium">
              <strong className="text-primary">CBO:</strong>{' '}
              {mostrarValor(data.cbo_code)} -
              {mostrarValor(data.cbo_description)}
            </p>
            <p className="font-medium">
              <strong className="text-primary">Renda Estimada:</strong>
              {mostrarValor(data.estimated_income)}
            </p>
          </div>
        </Card>
        {/* PEP */}
        <Card title="Pessoa Politicamente Exposta (PEP)">
          <div className="flex flex-wrap space-y-4 space-x-2">
            <p className="font-medium">
              <strong className="text-primary">PEP:</strong>
              {data.pep === null || data.pep === undefined
                ? 'N/A'
                : data.pep
                ? 'Sim'
                : 'Não'}
            </p>
            {data.pep && (
              <p className="font-medium">
                <strong className="text-primary">Tipo de PEP:</strong>{' '}
                {mostrarValor(data.pep_type)}
              </p>
            )}
          </div>
        </Card>
        {/* Endereços */}
        <Card title="Endereços">
          {data.addresses && data.addresses.length > 0 ? (
            <div>
              {data.addresses.map((addr: any, idx: any) => (
                <div
                  key={idx}
                  className="border-b border-gray-400 last:border-b-0 pb-2 bg-gray-100 p-2 rounded-xl mb-2"
                >
                  <div className="flex flex-wrap space-y-2 space-x-4 justify-between">
                    <p className="font-medium">
                      <strong className="text-primary">Tipo:</strong>{' '}
                      {mostrarValor(addr.type)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Rua:</strong>{' '}
                      {mostrarValor(addr.street)},{mostrarValor(addr.number)}
                      {addr.complement && mostrarValor(`- ${addr.complement}`)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Bairro:</strong>
                      {mostrarValor(addr.neighborhood)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Cidade:</strong>{' '}
                      {mostrarValor(addr.city)} -{mostrarValor(addr.district)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">CEP:</strong>{' '}
                      {mostrarValor(addr.postal_code)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Prioridade:</strong>
                      {mostrarValor(addr.priority)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhum endereço cadastrado.</div>
          )}
        </Card>
        {/* Telefones Celulares */}
        <Card title="Telefones Celulares">
          {data.mobile_phones && data.mobile_phones.length > 0 ? (
            <div>
              {data.mobile_phones.map((phone: any, idx: any) => (
                <div
                  key={idx}
                  className="border-b border-gray-400 last:border-b-0 pb-2 bg-gray-100  p-2 rounded-xl mb-2 justify-between"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium flex gap-2 items-center">
                      <strong className="text-primary">Número:</strong>(
                      {mostrarValor(phone.ddd)}){mostrarValor(phone.number)}
                      <Link
                        href={
                          phone.number
                            ? `https://wa.me/${phone.ddd + phone.number}`
                            : ''
                        }
                        target="_blank"
                        className="bg-emerald-600 rounded-md p-1"
                      >
                        <WhatsAppIcon color="white" />
                      </Link>
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Prioridade:</strong>
                      {mostrarValor(phone.priority)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Data CDR:</strong>
                      {mostrarValor(phone.cdr_datetime)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Data Hot:</strong>
                      {mostrarValor(phone.hot_datetime)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">data:</strong>
                      {mostrarValor(phone.whatsapp_datetime)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">CPC:</strong>
                      {mostrarValor(phone.cpc_datetime)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhum celular cadastrado.</div>
          )}
        </Card>
        {/* Telefones Fixos */}
        <Card title="Telefones Fixos">
          {data.land_lines && data.land_lines.length > 0 ? (
            <div>
              {data.land_lines.map((phone: any, idx: any) => (
                <div
                  key={idx}
                  className="border-b border-gray-400 last:border-b-0 pb-2 bg-gray-100  p-2 rounded-xl mb-2 justify-between"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong className="text-primary">Número:</strong>(
                      {mostrarValor(phone.ddd)}){mostrarValor(phone.number)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Prioridade:</strong>
                      {mostrarValor(phone.priority)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Data CDR:</strong>
                      {mostrarValor(phone.cdr_datetime)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Data Hot:</strong>
                      {mostrarValor(phone.hot_datetime)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">data:</strong>
                      <Link
                        href={
                          phone.whatsapp_datetime
                            ? `https://wa.me/${phone.whatsapp_datetime}`
                            : ''
                        }
                      >
                        {convertDateFromPostgres(
                          phone.whatsapp_datetime
                        )?.toString()}
                      </Link>
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">CPC:</strong>
                      {mostrarValor(phone.cpc_datetime)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhum telefone fixo cadastrado.</div>
          )}
        </Card>
        {/* E-mails */}
        <Card title="E-mails">
          {data.emails && data.emails.length > 0 ? (
            <div className="space-y-2">
              {data.emails.map((email: any, idx: any) => (
                <div
                  key={idx}
                  className="border-b border-gray-400 last:border-b-0 pb-2 bg-gray-100  p-2 rounded-xl mb-2"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong className="text-primary">E-mail:</strong>{' '}
                      {mostrarValor(email.email)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Prioridade:</strong>
                      {mostrarValor(email.priority)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhum e-mail cadastrado.</div>
          )}
        </Card>
        {/* Familiares */}
        <Card title="Familiares">
          {data.family_datas && data.family_datas.length > 0 ? (
            <div className="space-y-2">
              {data.family_datas.map((fam: any, idx: any) => (
                <div
                  key={idx}
                  className="border-b border-gray-400 last:border-b-0 pb-2 bg-gray-100  p-2 rounded-xl mb-2"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <p className="font-medium">
                      <strong className="text-primary">Nome:</strong>{' '}
                      {mostrarValor(fam.name)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">CPF:</strong>{' '}
                      {mostrarValor(fam.cpf)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Descrição:</strong>
                      {mostrarValor(fam.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhum familiar cadastrado.</div>
          )}
        </Card>
        {/* Empresas Relacionadas */}
        <Card title="Empresas Relacionadas">
          {data.related_companies && data.related_companies.length > 0 ? (
            <div className="space-y-2">
              {data.related_companies.map((company: any, idx: any) => (
                <div
                  key={idx}
                  className="border-b border-gray-400 last:border-b-0 pb-2 bg-gray-100  p-2 rounded-xl mb-2"
                >
                  <div className="flex flex-wrap space-y-4 space-x-9">
                    <div className="flex gap-2">
                      <p className="font-medium">
                        <strong className="text-primary">CNPJ:</strong>{' '}
                        {mostrarValor(company.cnpj)}
                      </p>
                      <Link
                        href={`/take-it/view-company/${company.cnpj}`}
                        className="bg-primary rounded"
                      >
                        <SearchIcon color="white" style={{ padding: '2px' }} />
                      </Link>
                    </div>

                    <p className="font-medium">
                      <strong className="text-primary">Razão Social:</strong>
                      {mostrarValor(company.company_name)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">Nome Fantasia:</strong>
                      {mostrarValor(company.trading_name)}
                    </p>
                    <p className="font-medium">
                      <strong className="text-primary">
                        Situação Cadastral:
                      </strong>
                      {mostrarValor(company.registry_situation)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhuma empresa relacionada cadastrada.</div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        title="Editar Candidato"
      >
        <CandidatoForm
          initialValues={convertDataStoneToCandidatoDTO(data)}
          onSuccess={candidato => {
            setShowModalEdit(prev => !prev);
            setIsSave(true);
            setCache(true);
            setCandidatoId(candidato.id);
          }}
        />
      </Modal>
    </div>
    //   )}
    // </TakeitLayout>
  );
}
